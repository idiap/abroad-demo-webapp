// SPDX-FileCopyrightText: 2025 Idiap Research Institute <contact@idiap.ch>
//
// SPDX-FileContributor: Delmas Maxime maxime.delmas@idiap.ch
// SPDX-FileContributor: Gusicuma Danilo danilo.gusicuma@idiap.ch
//
// SPDX-License-Identifier: GPL-3.0-or-later

export interface TableAlerts {
    head: TableAlertsHead
    results: TableAlertsResults
}

  interface TableAlertsHead {
    link: string[]
    vars: string[]
}

interface TableAlertsResults {
    distinct: boolean
    ordered: boolean
    bindings: TableAlertsBinding[]
}

export interface TableAlertsBinding {
    verbatim_identification: BindingData
    n_chemical_alert: BindingData
    n_organism_alert: BindingData
}

interface BindingData {
    type: string
    value: string
  }
