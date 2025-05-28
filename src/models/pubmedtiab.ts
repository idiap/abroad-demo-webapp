// SPDX-FileCopyrightText: 2025 Idiap Research Institute <contact@idiap.ch>
//
// SPDX-FileContributor: Delmas Maxime maxime.delmas@idiap.ch
// SPDX-FileContributor: Gusicuma Danilo danilo.gusicuma@idiap.ch
//
// SPDX-License-Identifier: GPL-3.0-or-later

export interface Pubmedtiab {
  head: PubmedtiabHead
  results: PubmedtiabResults
}

interface PubmedtiabHead {
  link: string[]
  vars: string[]
}

interface PubmedtiabResults {
  distinct: boolean
  ordered: boolean
  bindings: PubmedtiabBinding[]
}

export interface PubmedtiabBinding {
  title: BindingData
  abstract: BindingData
}

interface BindingData {
  type: string
  value: string
}
