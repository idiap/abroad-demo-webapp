// SPDX-FileCopyrightText: 2025 Idiap Research Institute <contact@idiap.ch>
//
// SPDX-FileContributor: Delmas Maxime maxime.delmas@idiap.ch
// SPDX-FileContributor: Gusicuma Danilo danilo.gusicuma@idiap.ch
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { ChemicalDetails } from "../models/chemicalDetails"
import { ChemicalLiterature } from "../models/chemicalLiterature"
import { Pubmedshact } from "../models/pubmedshact"
import { Pubmedtiab } from "../models/pubmedtiab"
import api from "./api"

export const getChemicalDetails = async (organismId: string, chemicalLabel: string): Promise<ChemicalDetails> => {
  const { data } = await api.post<ChemicalDetails>(``, {
    query: `DEFINE input:inference "schema-inference-rules"
    SELECT distinct ?rel_type ?doi ?pmid (str(?type_label) AS ?content_type) ?re_score ?tiab_content 
    WHERE
    {
        VALUES (?rel_type) { ("LotusNPR") ("TextNPR") }
        VALUES (?tiab_type) { ("Abstract") ("Title") }
        
        BIND("unknown" as ?default_doi)
        BIND("unknown" as ?default_pmid)
        BIND("unknown" as ?default_type_label)
        BIND("" as ?default_tiab_content)
        
        
        ?gbif_extended dwc:taxonID "${organismId}"  .
        ?chem rdfs:label "${chemicalLabel}" .
    
        ?ref sio:SIO_000628 ?gbif_extended, ?chem ;
          rdf:type/rdfs:label ?rel_type ;
          cito:citesAsEvidence ?lit_ref .
    
        OPTIONAL { 
                ?lit_ref prisms:doi ?lit_doi 
                } .
        OPTIONAL { 
                ?lit_ref (p:P698|pattern:isContainedBy) ?lit_pmid 
                } .
        OPTIONAL { 
            ?lit_ref c4o:hasContent ?lit_tiab_content ;
                rdf:type/rdfs:label ?lit_type_label ;
                sio:SIO_000008 [ rdf:type abroad:RetrieverScore ;
                    sio:SIO_000300 ?lit_re_score ] 
            } .
        BIND(if(?rel_type = "LotusNPR", "10"^^xsd:float, ?lit_re_score) AS ?re_score)
        
        BIND(coalesce(?lit_doi, ?default_doi) as ?doi)
        BIND(coalesce(?lit_pmid, ?default_pmid) as ?pmid)
        BIND(coalesce(?lit_type_label, ?default_type_label) as ?type_label)
        BIND(coalesce(?lit_tiab_content, ?default_tiab_content) as ?tiab_content)
    }
    ORDER BY DESC(?re_score)`,
    format: 'application/sparql-results+json'
  })
  return data
}

export const getChemicalLiterature = async (chemicalLabel: string): Promise<ChemicalLiterature> => {
  const { data } = await api.post<ChemicalLiterature>(``, {
    query: `DEFINE input:inference "schema-inference-rules"
    SELECT distinct ?g ?pmid ?evidence_class ?activity_score (STR(?e_chunk) AS ?evidence) ?title ?abstract
    WHERE
    {
        VALUES ?g { <http://www.abroad-resources/TiabFetchedDocumentDiscusses/2.0> <http://www.abroad-resources/supplementary-cito-discusses-Tiab> }
        ?chem rdfs:label "${chemicalLabel}" .
        GRAPH ?g {
            ?chem cito:isDiscussedBy ?pmid .
        }
        ?pmid dcterms:title ?title ;
            dcterms:abstract ?abstract ;
            sio:SIO_000008 [ a abroad:SS3ClassifierActivityScore ;
                sio:SIO_000300 ?activity_score ] .
    
        BIND("No evidence extracted." as ?default_evidence_chunk)
        BIND(<http://www.abroad-ontology#Supplementary> as ?default_ev_class)
    
        OPTIONAL {
            ?activity_chunk_evidence a ?ev_class ;
                sio:SIO_000628 ?chem ;
                dcterms:source ?pmid ;
                cito:citesAsEvidence [ a doco:TextChunk ;
                    c4o:hasContent ?evidence_chunk ] .
            }
            
        BIND(coalesce(?ev_class, ?default_ev_class) as ?updated_ev_class)
        BIND(coalesce(?evidence_chunk, ?default_evidence_chunk) as ?e_chunk)
        VALUES (?updated_ev_class) { ( <http://www.abroad-ontology#Supplementary> ) ( abroad:StrongActivityEvidence ) ( abroad:MediumActivityEvidence ) ( abroad:WeakActivityEvidence )}
        VALUES (?updated_ev_class ?evidence_class) {
            (<http://www.abroad-ontology#Supplementary> "Supplementary")
            (abroad:StrongActivityEvidence "Strong")
            (abroad:MediumActivityEvidence "Medium")
            (abroad:WeakActivityEvidence "Weak")
        }
    }
    ORDER BY DESC(?activity_score)`,
    format: 'application/sparql-results+json'
  })
  return data
}

export const getPubmedtiab = async (chemicalLabel: string): Promise<Pubmedtiab> => {
  const { data } = await api.post<Pubmedtiab>(``, {
    query: `DEFINE input:inference "schema-inference-rules"
    SELECT ?title ?abstract
    WHERE
    {
        
        pubmed:${chemicalLabel} dcterms:title ?title ;
            dcterms:abstract ?abstract .
    
    }`,
    format: 'application/sparql-results+json'
  })
  return data
}

export const getPubmedmeshact = async (chemicalLabel: string): Promise<Pubmedshact> => {
  const { data } = await api.post<Pubmedshact>(``, {
    query: `DEFINE input:inference "schema-inference-rules"
    SELECT ?label ?activity_score
    WHERE
    {
        pubmed:${chemicalLabel} fabio:hasSubjectTerm ?mesh .
        ?mesh rdfs:label ?label ;
            sio:SIO_000008 [ rdf:type abroad:MeSHActivityScore ;
                sio:SIO_000300 ?activity_score ] .
    }
    ORDER BY DESC(?activity_score)`,
    format: 'application/sparql-results+json'
  })
  return data
}
