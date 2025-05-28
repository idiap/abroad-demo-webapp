// SPDX-FileCopyrightText: 2025 Idiap Research Institute <contact@idiap.ch>
//
// SPDX-FileContributor: Delmas Maxime maxime.delmas@idiap.ch
// SPDX-FileContributor: Gusicuma Danilo danilo.gusicuma@idiap.ch
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { OrganismInfo } from "../models/organismInfo"
import { OrganismLiterature } from "../models/organismLiterature"
import { OrganismRelation } from "../models/organismRelation"
import api from "./api"

export const getOrganismInfo = async (organismId: string): Promise<OrganismInfo> => {
  const { data } = await api.post<OrganismInfo>(``, {
    query: `DEFINE input:inference "schema-inference-rules"
    SELECT  ?specie_label (group_concat(?synonym_label ; separator=", ") as ?concat_synonyms) ?specie_dataset ?specie_publication ?specie_sc_name ?specie_authorship ?specie_rank ?specie_status
    WHERE
    {
        ?gbif a abroad:AcceptedTaxon ;
            dwc:taxonID "${organismId}" ;
            rdfs:label ?specie_label . 
        
        BIND("unknown"  as ?default)
    
        OPTIONAL { ?gbif dwciri:inDataset ?a_specie_dataset } .
        OPTIONAL { ?gbif dwc:namePublishedIn ?a_specie_publication } .
        OPTIONAL { ?gbif dwc:scientificName ?a_specie_sc_name } .
        OPTIONAL { ?gbif dwc:scientificNameAuthorship ?a_specie_authorship } .
        OPTIONAL { ?gbif dwc:taxonRank ?a_specie_rank } .
        OPTIONAL { ?gbif dwc:taxonomicStatus ?a_specie_status } .
        
        OPTIONAL { ?gbif abroad:hasSynonymTaxon/rdfs:label ?a_synonym_label } .
        BIND(coalesce(?a_specie_dataset, ?default) as ?specie_dataset)
        BIND(coalesce(?a_specie_publication, ?default) as ?specie_publication)   
        BIND(coalesce(?a_specie_sc_name, ?default) as ?specie_sc_name)   
        BIND(coalesce(?a_specie_authorship, ?default) as ?specie_authorship)   
        BIND(coalesce(?a_specie_rank, ?default) as ?specie_rank)   
        BIND(coalesce(?a_specie_status, ?default) as ?specie_status)   
        BIND(coalesce(?a_synonym_label, ?default) as ?synonym_label)   
    }`,
    format: 'application/sparql-results+json'
  })
  return data
}

export const getStrongOrganismRelations = async (organismId: string): Promise<OrganismRelation> => {
  const { data } = await api.post<OrganismRelation>(``, {
    query: `DEFINE input:inference "schema-inference-rules"
    SELECT distinct ?gbif_extended ?gbif_extended_id ?specie_linked_label ?chem_label (MAX(?re_score) AS ?max_re_score) (group_concat(distinct ?rel_type ; separator=", ") as ?all_rel_types) (group_concat(distinct ?lit_id ; separator=", ") as ?literature_ids)
    WHERE
    {
        ?gbif a abroad:AcceptedTaxon ;
            dwc:taxonID "${organismId}" ;
            abroad:hasChildTaxon?/abroad:hasSynonymTaxon? ?gbif_extended .
        
        VALUES (?rel_type) { ("LotusNPR") ("TiabNPR") ("ChunkNPR") }
        BIND(10 as ?default_re_score)
        
        ?gbif_extended abroad:taxonProduces ?chem ;
            rdfs:label ?specie_linked_label ;
            dwc:taxonID ?gbif_extended_id .
    
        ?chem rdfs:label ?chem_label .
    
        ?ev a abroad:StrongActivityEvidence ;
            sio:SIO_000628/rdfs:label ?chem_label  .
    
        ?ref sio:SIO_000628 ?gbif_extended, ?chem ;
            rdf:type/rdfs:label ?rel_type ;
            cito:citesAsEvidence ?lit_ref .
    
        OPTIONAL {?lit_ref sio:SIO_000008 [ rdf:type abroad:RetrieverScore ;
            sio:SIO_000300 ?lit_re_score ] . }
    
        BIND(coalesce(?lit_re_score, ?default_re_score) as ?re_score)
    
        ?lit_ref (prisms:doi|pattern:isContainedBy) ?lit_id .
    }
    ORDER BY DESC (?max_re_score)
    `,
    format: 'application/sparql-results+json'
  })
  return data
}


export const getMediumOrganismRelations = async (organismId: string): Promise<OrganismRelation> => {
    const { data } = await api.post<OrganismRelation>(``, {
    query: `DEFINE input:inference "schema-inference-rules"
    SELECT distinct ?gbif_extended ?gbif_extended_id ?specie_linked_label ?chem_label (MAX(?re_score) AS ?max_re_score) ("Medium" AS ?ev_class) (group_concat(distinct ?rel_type ; separator=", ") as ?all_rel_types) (group_concat(distinct ?lit_id ; separator=", ") as ?literature_ids)
    WHERE
    {
        ?gbif a abroad:AcceptedTaxon ;
            dwc:taxonID "${organismId}" ;
            abroad:hasChildTaxon?/abroad:hasSynonymTaxon? ?gbif_extended .
        
        VALUES (?rel_type) { ("LotusNPR") ("TiabNPR") ("ChunkNPR") }
        BIND(10 as ?default_re_score)
        
        ?gbif_extended abroad:taxonProduces ?chem ;
            rdfs:label ?specie_linked_label ;
            dwc:taxonID ?gbif_extended_id .
    
        ?chem rdfs:label ?chem_label .
    
        ?ev a abroad:MediumActivityEvidence ;
            sio:SIO_000628/rdfs:label ?chem_label  .
    
        ?ref sio:SIO_000628 ?gbif_extended, ?chem ;
            rdf:type/rdfs:label ?rel_type ;
            cito:citesAsEvidence ?lit_ref .
    
        OPTIONAL {?lit_ref sio:SIO_000008 [ rdf:type abroad:RetrieverScore ;
            sio:SIO_000300 ?lit_re_score ] . }
    
        BIND(coalesce(?lit_re_score, ?default_re_score) as ?re_score)
    
        ?lit_ref (prisms:doi|pattern:isContainedBy) ?lit_id .
        FILTER NOT EXISTS {?alt_ev a  abroad:StrongActivityEvidence ;
            sio:SIO_000628/rdfs:label ?chem_label  .
        }
    
    }
    ORDER BY DESC (?max_re_score)`,
    format: 'application/sparql-results+json'
    })
    return data
  }

  export const getWeakOrganismRelations = async (organismId: string): Promise<OrganismRelation> => {
    const { data } = await api.post<OrganismRelation>(``, {
    query: `DEFINE input:inference "schema-inference-rules"
    SELECT distinct ?gbif_extended ?gbif_extended_id ?specie_linked_label ?chem_label (MAX(?re_score) AS ?max_re_score) ("Weak" AS ?ev_class) (group_concat(distinct ?rel_type ; separator=", ") as ?all_rel_types) (group_concat(distinct ?lit_id ; separator=", ") as ?literature_ids)
    WHERE
    {

        ?gbif a abroad:AcceptedTaxon ;
            dwc:taxonID "${organismId}" ;
            abroad:hasChildTaxon?/abroad:hasSynonymTaxon? ?gbif_extended .
        
        VALUES (?rel_type) { ("LotusNPR") ("TiabNPR") ("ChunkNPR") }
        BIND(10 as ?default_re_score)
    
            
        ?gbif_extended abroad:taxonProduces ?chem ;
            rdfs:label ?specie_linked_label ;
            dwc:taxonID ?gbif_extended_id .
    
        ?chem rdfs:label ?chem_label .
    
        ?ev a abroad:WeakActivityEvidence ;
            sio:SIO_000628/rdfs:label ?chem_label  .
    
        ?ref sio:SIO_000628 ?gbif_extended, ?chem ;
            rdf:type/rdfs:label ?rel_type ;
            cito:citesAsEvidence ?lit_ref .
    
        OPTIONAL {?lit_ref sio:SIO_000008 [ rdf:type abroad:RetrieverScore ;
            sio:SIO_000300 ?lit_re_score ] . }
    
        BIND(coalesce(?lit_re_score, ?default_re_score) as ?re_score)
    
        ?lit_ref (prisms:doi|pattern:isContainedBy) ?lit_id .
    
        FILTER NOT EXISTS {
            VALUES (?no_ev_class) { (abroad:StrongActivityEvidence) (abroad:MediumActivityEvidence) }
        ?alt_ev a  ?no_ev_class ;
            sio:SIO_000628/rdfs:label ?chem_label  .
        }
    
    }
    ORDER BY DESC (?max_re_score)`,
    format: 'application/sparql-results+json'
    })
    return data
  }

export const getSupplementaryOrganismRelations = async (organismId: string): Promise<OrganismRelation> => {
    const { data } = await api.post<OrganismRelation>(``, {
    query: `
    DEFINE input:inference "schema-inference-rules"
    SELECT distinct ?gbif_extended ?gbif_extended_id ?specie_linked_label ?chem_label (MAX(?re_score) AS ?max_re_score) ("Supplementary" AS ?ev_class) (group_concat(distinct ?rel_type ; separator=", ") as ?all_rel_types) (group_concat(distinct ?lit_id ; separator=", ") as ?literature_ids)
    WHERE
    {
    
        ?gbif a abroad:AcceptedTaxon ;
            dwc:taxonID "${organismId}" ;
            abroad:hasChildTaxon?/abroad:hasSynonymTaxon? ?gbif_extended .
            
        VALUES (?rel_type) { ("LotusNPR") ("TiabNPR") ("ChunkNPR") }
        BIND(10 as ?default_re_score)
        
        ?gbif_extended abroad:taxonProduces ?chem ;
            rdfs:label ?specie_linked_label ;
            dwc:taxonID ?gbif_extended_id .
    
        ?chem rdfs:label ?chem_label .
    
        ?ref sio:SIO_000628 ?gbif_extended, ?chem ;
            rdf:type/rdfs:label ?rel_type ;
            cito:citesAsEvidence ?lit_ref .
    
        OPTIONAL {?lit_ref sio:SIO_000008 [ rdf:type abroad:RetrieverScore ;
            sio:SIO_000300 ?lit_re_score ] . }
    
        BIND(coalesce(?lit_re_score, ?default_re_score) as ?re_score)
    
        ?lit_ref (prisms:doi|pattern:isContainedBy) ?lit_id .
    
        FILTER NOT EXISTS {
        ?alt_ev a  abroad:ActivityEvidence ;
            sio:SIO_000628/rdfs:label ?chem_label  .
        }
    
    }
    ORDER BY DESC (?max_re_score)`,
    format: 'application/sparql-results+json'
    })
    return data
  }
export const getOrganismLiterature = async (organismId: string): Promise<OrganismLiterature> => {
  const { data } = await api.post(``, {
    query: `DEFINE input:inference "schema-inference-rules"
    SELECT distinct ?g ?pmid ?evidence_class ?activity_score (STR(?e_chunk) AS ?evidence) ?title ?abstract
    WHERE
    {
        VALUES ?g { <http://www.abroad-resources/TiabFetchedDocumentDiscusses/2.0> <http://www.abroad-resources/supplementary-cito-discusses-Tiab> }
        
        {
            SELECT DISTINCT ?gbif_extended
            WHERE {
                ?gbif a abroad:AcceptedTaxon ;
                    dwc:taxonID "${organismId}" ;
                    abroad:hasChildTaxon?/abroad:hasSynonymTaxon? ?gbif_extended .
            }
        }
        GRAPH ?g {
            ?gbif_extended cito:isDiscussedBy ?pmid .
        }
        ?pmid dcterms:title ?title ;
            dcterms:abstract ?abstract ;
            sio:SIO_000008 [ a abroad:SS3ClassifierActivityScore ;
                sio:SIO_000300 ?activity_score ] .
    
        BIND("No evidence extracted." as ?default_evidence_chunk)
        BIND(<http://www.abroad-ontology#Supplementary> as ?default_ev_class)
    
        OPTIONAL {
            ?activity_chunk_evidence a ?ev_class ;
                sio:SIO_000628 ?gbif_extended ;
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
