// SPDX-FileCopyrightText: 2025 Idiap Research Institute <contact@idiap.ch>
//
// SPDX-FileContributor: Delmas Maxime maxime.delmas@idiap.ch
// SPDX-FileContributor: Gusicuma Danilo danilo.gusicuma@idiap.ch
//
// SPDX-License-Identifier: GPL-3.0-or-later

export interface Pubmedshact {
  head: PubmedshactHead
  results: PubmedshactResults
}

interface PubmedshactHead {
  link: string[]
  vars: string[]
}

interface PubmedshactResults {
  distinct: boolean
  ordered: boolean
  bindings: PubmedshactBinding[]
}

export interface PubmedshactBinding {
  activity_score: BindingData
  label: BindingData
}

interface BindingData {
  type: string
  value: string
}
