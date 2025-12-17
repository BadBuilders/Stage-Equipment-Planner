
import { Camera, Lightbulb, Music, Monitor, Mic, Speaker, User } from 'lucide-react';
import type { EquipmentType } from './types';

export const EQUIPMENT_TYPES: EquipmentType[] = [
  { id: 'camera', name: 'Camera', icon: Camera, color: 'bg-blue-500' },
  { id: 'light', name: 'Light', icon: Lightbulb, color: 'bg-yellow-500' },
  { id: 'speaker', name: 'Speaker', icon: Speaker, color: 'bg-purple-500' },
  { id: 'mic', name: 'Microphone', icon: Mic, color: 'bg-red-500' },
  { id: 'monitor', name: 'Monitor', icon: Monitor, color: 'bg-green-500' },
  { id: 'instrument', name: 'Instrument', icon: Music, color: 'bg-orange-500' },
  { id: 'person', name: 'Person', icon: User, color: 'bg-pink-500' },
];
