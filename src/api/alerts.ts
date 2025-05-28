// SPDX-FileCopyrightText: 2025 Idiap Research Institute <contact@idiap.ch>
//
// SPDX-FileContributor: Delmas Maxime maxime.delmas@idiap.ch
// SPDX-FileContributor: Gusicuma Danilo danilo.gusicuma@idiap.ch
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { TableAlerts } from "../models/tableAlerts"
import api from "./api"

export const alerts = async (evClass: string): Promise<TableAlerts> => {
  const { data } = await api.post<any>('', {
    query: `DEFINE input:inference "schema-inference-rules"
    SELECT ?verbatim_identification ?n_chemical_alert ?n_organism_alert
    WHERE {
        
        ?identification a dwc:Identification ;
            dwc:verbatimIdentification ?verbatim_identification .
        OPTIONAL { ?identification sio:SIO_000008 [ a abroad:NumberOfOrganismLiteratureAlerts ;
                sio:SIO_000008 "${evClass}" ;
                sio:SIO_000300 ?n_organism_alerts ] . }
        OPTIONAL { ?identification sio:SIO_000008 [ a abroad:NumberOfChemicalLiteratureAlerts ;
                sio:SIO_000008 "${evClass}" ;
                sio:SIO_000300 ?n_chemical_alerts ] . }
    BIND (0 AS ?no_alert) .
    BIND(coalesce(?n_organism_alerts, ?no_alert) as ?n_organism_alert)
    BIND(coalesce(?n_chemical_alerts, ?no_alert) as ?n_chemical_alert)
    BIND((?n_organism_alert + ?n_chemical_alert) AS ?TT)
    }
    ORDER BY DESC(?TT)`,
    format: 'application/sparql-results+json'
  })
  return data
}
