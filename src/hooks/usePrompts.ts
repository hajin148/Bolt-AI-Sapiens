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
    
    // Trigger sidebar refresh
    console.log('Triggering sidebar refresh from createSession');
    window.dispatchEvent(new CustomEvent('refreshPromptSessions'));
    
    return data;
  };

  const updateSession = async (id: string, updates: Partial<CreatePromptSessionData>) => {
    const { error } = await supabase
      .from('prompt_sessions')
      .update(updates)
      .eq('id', id);

    if (error) throw error;
    await fetchSessions();
    
    // Trigger sidebar refresh
    window.dispatchEvent(new CustomEvent('refreshPromptSessions'));
  };

  const deleteSession = async (id: string) => {
    const { error } = await supabase
      .from('prompt_sessions')
      .delete()
      .eq('id', id);

    if (error) throw error;
    await fetchSessions();
    
    // Trigger sidebar refresh
    window.dispatchEvent(new CustomEvent('refreshPromptSessions'));
  };

  // New function to delete empty sessions
  const deleteEmptySession = async (sessionId: string) => {
    try {
      // Check if session has any messages
      const { data: messages, error: messagesError } = await supabase
        .from('prompt_messages')
        .select('id')
        .eq('session_id', sessionId)
        .limit(1);

      if (messagesError) throw messagesError;

      // If no messages exist, delete the session
      if (!messages || messages.length === 0) {
        await deleteSession(sessionId);
        return true; // Session was deleted
      }
      
      return false; // Session was not deleted (has messages)
    } catch (error) {
      console.error('Error checking/deleting empty session:', error);
      return false;
    }
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
    deleteEmptySession,
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