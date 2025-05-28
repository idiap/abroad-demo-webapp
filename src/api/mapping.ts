// SPDX-FileCopyrightText: 2025 Idiap Research Institute <contact@idiap.ch>
//
// SPDX-FileContributor: Delmas Maxime maxime.delmas@idiap.ch
// SPDX-FileContributor: Gusicuma Danilo danilo.gusicuma@idiap.ch
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { Mapping } from "../models/mapping"
import api from "./api"

export const mapping = async (): Promise<Mapping> => {
  const { data } = await api.post<any>('', {
    query: `DEFINE input:inference "schema-inference-rules"
  SELECT DISTINCT ?main_gbif ?main_gbif_id ?specie_label
  WHERE
  {
      [] a dwc:Identification ;
          dwciri:toTaxon/abroad:hasChildTaxon?  ?main_gbif .
  
      ?main_gbif a abroad:AcceptedTaxon ;
          dwc:taxonID ?main_gbif_id ;
          abroad:hasSynonymTaxon? ?gbif_internal_specie .
  
      ?gbif_internal_specie rdfs:label ?specie_label .
  }`,
    format: 'application/sparql-results+json'
  })
  return data
}
