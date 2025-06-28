import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Classroom, Module, CreateClassroomData, CreateModuleData } from '../types/Learning';

export const useLearningSpace = () => {
  const { currentUser } = useAuth();
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClassrooms = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('classrooms')
        .select(`
          *,
          modules(count)
        `)
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const classroomsWithCount = data?.map(classroom => ({
        ...classroom,
        module_count: classroom.modules?.[0]?.count || 0
      })) || [];

      setClassrooms(classroomsWithCount);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch classrooms');
    } finally {
      setLoading(false);
    }
  };

  const createClassroom = async (classroomData: CreateClassroomData) => {
    if (!currentUser) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('classrooms')
      .insert({
        ...classroomData,
        user_id: currentUser.id
      })
      .select()
      .single();

    if (error) throw error;
    
    await fetchClassrooms();
    
    // Trigger sidebar refresh
    window.dispatchEvent(new CustomEvent('refreshClassrooms'));
    
    return data;
  };

  const updateClassroom = async (id: string, updates: Partial<CreateClassroomData>) => {
    const { error } = await supabase
      .from('classrooms')
      .update(updates)
      .eq('id', id);

    if (error) throw error;
    await fetchClassrooms();
    
    // Trigger sidebar refresh
    window.dispatchEvent(new CustomEvent('refreshClassrooms'));
  };

  const deleteClassroom = async (id: string) => {
    const { error } = await supabase
      .from('classrooms')
      .delete()
      .eq('id', id);

    if (error) throw error;
    await fetchClassrooms();
    
    // Trigger sidebar refresh
    window.dispatchEvent(new CustomEvent('refreshClassrooms'));
  };

  useEffect(() => {
    fetchClassrooms();
  }, [currentUser]);

  return {
    classrooms,
    loading,
    error,
    createClassroom,
    updateClassroom,
    deleteClassroom,
    refetch: fetchClassrooms
  };
};

export const useClassroomModules = (classroomId: string) => {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchModules = async () => {
    if (!classroomId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('modules')
        .select('*')
        .eq('classroom_id', classroomId)
        .order('step_number', { ascending: true });

      if (error) throw error;
      setModules(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch modules');
    } finally {
      setLoading(false);
    }
  };

  const createModule = async (moduleData: Omit<CreateModuleData, 'classroom_id'>) => {
    const { data, error } = await supabase
      .from('modules')
      .insert({
        ...moduleData,
        classroom_id: classroomId
      })
      .select()
      .single();

    if (error) throw error;
    await fetchModules();
    return data;
  };

  const updateModule = async (id: string, updates: Partial<Omit<CreateModuleData, 'classroom_id'>>) => {
    const { error } = await supabase
      .from('modules')
      .update(updates)
      .eq('id', id);

    if (error) throw error;
    await fetchModules();
  };

  const deleteModule = async (id: string) => {
    const { error } = await supabase
      .from('modules')
      .delete()
      .eq('id', id);

    if (error) throw error;
    await fetchModules();
  };

  const reorderModules = async (reorderedModules: Module[]) => {
    const updates = reorderedModules.map((module, index) => ({
      id: module.id,
      step_number: index + 1
    }));

    for (const update of updates) {
      await supabase
        .from('modules')
        .update({ step_number: update.step_number })
        .eq('id', update.id);
    }

    await fetchModules();
  };

  useEffect(() => {
    fetchModules();
  }, [classroomId]);

  return {
    modules,
    loading,
    error,
    createModule,
    updateModule,
    deleteModule,
    reorderModules,
    refetch: fetchModules
  };
};