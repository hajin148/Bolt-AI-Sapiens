export interface Classroom {
  id: string;
  name: string;
  description: string;
  color: string;
  user_id: string;
  created_at: string;
  module_count?: number;
}

export interface Module {
  id: string;
  classroom_id: string;
  title: string;
  description: string;
  step_number: number;
  created_at: string;
}

export interface CreateClassroomData {
  name: string;
  description: string;
  color: string;
}

export interface CreateModuleData {
  classroom_id: string;
  title: string;
  description: string;
  step_number: number;
}