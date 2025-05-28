// SPDX-FileCopyrightText: 2025 Idiap Research Institute <contact@idiap.ch>
//
// SPDX-FileContributor: Delmas Maxime maxime.delmas@idiap.ch
// SPDX-FileContributor: Gusicuma Danilo danilo.gusicuma@idiap.ch
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { DescriptionsProps } from 'antd';
import { OrganismInfo, OrganismInfoBinding } from '../models/organismInfo';


interface OrganismInfoListProps {
    organismInfo: OrganismInfo | null
  }
  

  const OrganismInfoList: React.FC<OrganismInfoListProps> = ({ organismInfo }) => {
    const items: DescriptionsProps['items'] = [];
    
    organismInfo?.results.bindings.forEach((binding) => {
      return Object.keys(binding).forEach((bindingKey) => {
        // Push items into the Descriptions component
        items.push({
          key: items.length,
          label: (bindingKey.charAt(0).toUpperCase() + bindingKey.slice(1)).replaceAll('_', ' '),
          children: binding[bindingKey as keyof OrganismInfoBinding].value
        });
      });
    });
  
    // Split items into two columns
    const itemsColumn1 = items.slice(0, Math.ceil(items.length / 2));
    const itemsColumn2 = items.slice(Math.ceil(items.length / 2));
  
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <div>
          {itemsColumn1.map((item) => (
            <div key={item.key} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <strong>{item.label}: </strong>&nbsp;{item.children}
            </div>
          ))}
        </div>
        <div>
          {itemsColumn2.map((item) => (
            <div key={item.key} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <strong>{item.label}: </strong>&nbsp;{item.children}
            </div>
          ))}
        </div>
      </div>
    );
  };
export default OrganismInfoList
