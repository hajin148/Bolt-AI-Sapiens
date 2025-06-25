import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { PromptSession, PromptMessage, CreatePromptSessionData, CreatePromptMessageData } from '../types/Prompt';

export const usePrompts = () => {
  const { currentUser } = useAuth();
  const [sessions, setSessions] = useState<PromptSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('prompt_sessions')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setSessions(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch sessions');
    } finally {
      setLoading(false);
    }
  };

  const createSession = async (sessionData: CreatePromptSessionData) => {
    if (!currentUser) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('prompt_sessions')
      .insert({
        ...sessionData,
        user_id: currentUser.id
      })
      .select()
      .single();

    if (error) throw error;
    
    await fetchSessions();
    return data;
  };

  const updateSession = async (id: string, updates: Partial<CreatePromptSessionData>) => {
    const { error } = await supabase
      .from('prompt_sessions')
      .update(updates)
      .eq('id', id);

    if (error) throw error;
    await fetchSessions();
  };

  const deleteSession = async (id: string) => {
    const { error } = await supabase
      .from('prompt_sessions')
      .delete()
      .eq('id', id);

    if (error) throw error;
    await fetchSessions();
  };

  useEffect(() => {
    fetchSessions();
  }, [currentUser]);

  return {
    sessions,
    loading,
    error,
    createSession,
    updateSession,
    deleteSession,
    refetch: fetchSessions
  };
};

export const usePromptMessages = (sessionId: string) => {
  const [messages, setMessages] = useState<PromptMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = async () => {
    if (!sessionId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('prompt_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  const addMessage = async (messageData: CreatePromptMessageData) => {
    const { data, error } = await supabase
      .from('prompt_messages')
      .insert(messageData)
      .select()
      .single();

    if (error) throw error;
    
    setMessages(prev => [...prev, data]);
    return data;
  };

  const deleteMessage = async (id: string) => {
    const { error } = await supabase
      .from('prompt_messages')
      .delete()
      .eq('id', id);

    if (error) throw error;
    await fetchMessages();
  };

  useEffect(() => {
    fetchMessages();
  }, [sessionId]);

  return {
    messages,
    loading,
    error,
    addMessage,
    deleteMessage,
    refetch: fetchMessages
  };
};