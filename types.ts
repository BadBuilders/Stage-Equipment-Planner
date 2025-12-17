
import type { LucideProps } from 'lucide-react';
import type React from 'react';

export type EquipmentTypeId = 'camera' | 'light' | 'speaker' | 'mic' | 'monitor' | 'instrument' | 'person';

export interface EquipmentType {
  id: EquipmentTypeId;
  name: string;
  icon: React.ComponentType<LucideProps>;
  color: string;
}

export interface PlacedItem {
  id: number;
  type: EquipmentTypeId;
  x: number;
  y: number;
  rotation: number;
}
