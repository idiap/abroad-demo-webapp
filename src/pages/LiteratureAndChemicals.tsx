// SPDX-FileCopyrightText: 2025 Idiap Research Institute <contact@idiap.ch>
//
// SPDX-FileContributor: Delmas Maxime maxime.delmas@idiap.ch
// SPDX-FileContributor: Gusicuma Danilo danilo.gusicuma@idiap.ch
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { Col, Row, Spin, Typography, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { getOrganismInfo, getOrganismLiterature, getStrongOrganismRelations, getMediumOrganismRelations, getWeakOrganismRelations, getSupplementaryOrganismRelations} from '../api/organisms';
import Table, { ColumnsType } from 'antd/es/table';
import { OrganismRelation } from '../models/organismRelation';
import { OrganismInfo } from '../models/organismInfo';
import OrganismInfoList from '../components/OrganismInfoList';
import { OrganismLiterature } from '../models/organismLiterature';
import OrganismLiteratureView from '../components/OrganismLiteratureView';
import { getChemicalDetails, getChemicalLiterature } from '../api/chemicals';
import { ChemicalDetails } from '../models/chemicalDetails';
import ChemicalDetailsView from '../components/ChemicalDetailsView';
import ChemicalLiteratureView from '../components/ChemicalLiteratureView';
import { ChemicalLiterature } from '../models/chemicalLiterature';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlask } from '@fortawesome/free-solid-svg-icons'; // Import the desired icon
import { faBook } from '@fortawesome/free-solid-svg-icons'; // Import the book icon
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
const { Title } = Typography

const { Text } = Typography;

    interface TableDataType {
    key: string
    organismOriginalLabel: string
    chemicalName: string
    type: string
    literatureReference: string
    extendedId: string
    details: string
    }

    const mapRelationToColumnsData = (relation: OrganismRelation): TableDataType[] => {
    return relation.results.bindings.map((binding, index) => {
        const column: TableDataType = {
        key: `${binding.gbif_extended_id.value}-${index}`,
        organismOriginalLabel: binding.specie_linked_label.value,
        chemicalName: binding.chem_label.value,
        type: binding.all_rel_types.value,
        literatureReference: binding.literature_ids.value,
        details: binding.chem_label.value,
        extendedId: binding.gbif_extended_id.value
        }
        return column
    })
    }

    const LiteratureAndChemicalsPage: React.FC = () => {
    const [organismInfo, setOrganismInfo] = useState<OrganismInfo | null>(null)
    const [columnsData, setColumnsData] = useState<TableDataType[]>([])
    const [organismLiterature, setOrganismLiterature] = useState<OrganismLiterature | null>(null)
    const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);
    const [chemDetails, setChemDetails] = useState<ChemicalDetails | null>(null)
    const [chemLitLabel, setChemLitLabel] = useState<string | null>(null)
    const [chemLitDetails, setChemLitDetails] = useState<ChemicalLiterature | null>(null)
    const [spinning, setSpinning] = useState<boolean>(false)
    const [relationType, setRelationType] = useState<string>('Strong'); // Default value
    const { orgId } = useParams()
    const organismId = orgId ?? ''

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRelationType(event.target.value);
    };

    useEffect(() => {
        setSpinning(true)
        let fetchFunction: (organismId: string) => Promise<any>;
        switch (relationType) {
        case 'Medium':
            fetchFunction = getMediumOrganismRelations;
            break;
        case 'Weak':
            fetchFunction = getWeakOrganismRelations;
            break;
        case 'Supplementary':
            fetchFunction = getSupplementaryOrganismRelations;
            break;
        case 'Strong':
        default:
            fetchFunction = getStrongOrganismRelations;
            break;
        }
        Promise.all([
        getOrganismInfo(organismId),
        fetchFunction(organismId),
        getOrganismLiterature(organismId)
        ]).then(values => {
        setOrganismInfo(values[0])
        setColumnsData(mapRelationToColumnsData(values[1]))
        setOrganismLiterature(values[2])
        setSpinning(false)
        }).catch(() => {
        setSpinning(false)
        })
    }, [organismId, relationType])
    
    const getChemDetails = (organismId: string, chemLabel: string) => {
        setSpinning(true)
        getChemicalDetails(organismId, chemLabel)
        .then(chemDetails => {
            setChemDetails(chemDetails)
            setSpinning(false)
        })
        .catch(() => {
            setSpinning(false)
        })
    }

    useEffect(() => {
        if (chemLitLabel !== null) {
        setSpinning(true)
        getChemicalLiterature(chemLitLabel)
            .then(chemLitDetails => {
            setChemLitDetails(chemLitDetails)
            setSpinning(false)
            })
            .catch(() => {
            setSpinning(false)
            })
        }
    }, [chemLitLabel])

    const columns: ColumnsType<TableDataType> = [
        {
        title: 'Organism',
        dataIndex: 'organismOriginalLabel',
        key: 'organismOriginalLabel',
        width: 100,
        render: (organismOriginalLabel) => { return (<Text style = {{ fontStyle: 'italic' }}>{organismOriginalLabel}</Text>)}
        },
        {
        title: 'Chemical Name',
        dataIndex: 'chemicalName',
        key: 'chemicalName',
        width: 100,
        },
        {
        title: <Tooltip title="Filter extracted relations by origin: LotusNPR (manually curated); TiabNPR (extrac from the title and abstract of a PubMed entry); ChunkNPR (Extract from a paragraph originating from the full-text of the article). As they can lack of context ChunkNPR relations should be considered carefully and always checked">Type</Tooltip>,
        dataIndex: 'type',
        key: 'type',
        width: 60,
        filters: [
            { text: 'LotusNPR', value: 'LotusNPR' },
            { text: 'TiabNPR', value: 'TiabNPR' },
            { text: 'ChunkNPR', value: 'ChunkNPR' },
        ],
        onFilter: (value, record) => record.type.includes(value.toString()),
        },
        {
        title: 'Literature Reference link(s)',
        dataIndex: 'literatureReference',
        key: 'literatureReference',
        width: 20,
        render: (links: string) => (
            <div>
            {links.split(', ').map((link: string, index: number) => (
                <a key={index} href={link.trim()} target='_blank' rel="noreferrer" style={{ marginRight: '5px' }}>
                <FontAwesomeIcon icon={faBook} />
                </a>
            ))}
            </div>
        )
    },
    {
        title: 'Search on PubChem',
        dataIndex: 'chemicalName',
        key: 'chemicalName',
        width: 20,
        render: (chemicalName) => (
            <a
            href={`https://pubchem.ncbi.nlm.nih.gov/#query=${encodeURIComponent(chemicalName)}`}
            target='_blank'
            rel="noreferrer">
            <div style={{ display: 'flex', height: '100%' }}>
                    <img src="https://pubchem.ncbi.nlm.nih.gov/pcfe/logo/PubChem_logo_splash.png" alt="PubMed Logo" style={{ width: '120px', height: '50px' }} />
                </div>
            </a>
        )
    }
    ]

    return <Row style={{
        margin: 'auto',
        padding: 32,
        width: '100%',
        maxWidth: 1500,
    }}>
        <Col
        style={{
            width: '100%',
        }}
        >
        <div style={{ display: 'flex', alignItems: 'center' }}>
    <FontAwesomeIcon icon={faInfoCircle} style={{ marginRight: '20px', fontSize: '3em' }} /> {/* Adjust the style as needed */}
    <Title>Organism description</Title>
            </div>
        <a href={`https://www.gbif.org/species/${organismId}`} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}>See on GBIF</a>
        <br />
        <br />
        <OrganismInfoList organismInfo={organismInfo} />
        <hr />
        <Row align="middle">
            <Col>
                <FontAwesomeIcon icon={faFlask} style={{ fontSize: '24px', marginRight: '8px' }} />
            </Col>
            <Col style={{ marginBottom: '0' }}>
                <Title level={2}>List of extracted natural products:</Title></Col>
        </Row>
        <div className="checkbox-group">
        <Typography.Title  style={{ marginTop: '0' }}  level={5}>Type of literature evidences</Typography.Title>
        <div className="checkbox-container">
            <label>
            <Tooltip title="The evidence for the antibiotic potential of the organism or isolated chemicals are clear and strong.">
                <input
                type="checkbox"
                value="Strong"
                checked={relationType === 'Strong'}
                onChange={handleCheckboxChange}
                />
                Strong
            </Tooltip>
            </label>
            <label>
            <Tooltip title="The evidence for the antibiotic potential of the organism or isolated chemicals are indirects or need to be confirmed by further experiments.">
                <input
                type="checkbox"
                value="Medium"
                checked={relationType === 'Medium'}
                onChange={handleCheckboxChange}
                />
                Medium
            </Tooltip>
            </label>
            <label>
            <Tooltip title="No or very weak evidence">
                <input
                type="checkbox"
                value="Weak"
                checked={relationType === 'Weak'}
                onChange={handleCheckboxChange}
                />
                Weak
            </Tooltip>
            </label>
            <label>
            <Tooltip title="Un-processed document with very low a priori evidence">
                <input
                type="checkbox"
                value="Supplementary"
                checked={relationType === 'Supplementary'}
                onChange={handleCheckboxChange}
                />
                Supplementary
            </Tooltip>
            </label>
        </div>
        </div>
        <Table
            columns={columns}
            dataSource={columnsData}
            scroll={{ x: 1300 }}
            pagination={{}}
            expandable={{
            expandedRowKeys: expandedRowKeys,
            expandedRowRender: (chemItem) => {
                return <>
                <Title level={4}>{chemItem.chemicalName}</Title>
                <ChemicalLiteratureView chemicalLiterature={chemLitDetails} />
                <ChemicalDetailsView chemicalDetails={chemDetails} chemLabel={chemItem.chemicalName} />
                </>
            },
            onExpand: (expanded, chemItem) => {
                const keys: string[] = []
                setChemDetails(null)
                setChemLitDetails(null)
                if (expanded) {
                getChemDetails(chemItem.extendedId, chemItem.details)
                setChemLitLabel(chemItem.chemicalName)
                keys.push(chemItem.key)
                }
                setExpandedRowKeys(keys);
            },
            rowExpandable: () => true
            }}
        />
        <Row align="middle">

    <Col>
        <FontAwesomeIcon icon={faBook} style={{ fontSize: '24px', marginRight: '8px' }} />
    </Col>
    <Col>
        <Title level={3}>Literature of the organism</Title>
    </Col>
    </Row>
        <OrganismLiteratureView organismLiterature={organismLiterature} />
        </Col>
        <Spin spinning={spinning} fullscreen />
    </Row>
    
    }

export default LiteratureAndChemicalsPage
