import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  booking_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
  sender_name?: string;
}

interface MessagesSectionProps {
  bookingId: string;
}

export function MessagesSection({ bookingId }: MessagesSectionProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState<Record<string, string>>({});

  // Fetch messages and set up realtime subscription
  useEffect(() => {
    if (!bookingId || !user) return;

    const fetchMessages = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('booking_id', bookingId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
      } else {
        setMessages(data || []);
        
        // Fetch sender names
        const senderIds = [...new Set((data || []).map(m => m.sender_id))];
        if (senderIds.length > 0) {
          const { data: profilesData } = await supabase
            .from('profiles')
            .select('user_id, full_name')
            .in('user_id', senderIds);
          
          if (profilesData) {
            const profileMap: Record<string, string> = {};
            profilesData.forEach(p => {
              profileMap[p.user_id] = p.full_name;
            });
            setProfiles(profileMap);
          }
        }

        // Mark unread messages as read
        const unreadIds = (data || [])
          .filter(m => !m.is_read && m.sender_id !== user.id)
          .map(m => m.id);
        
        if (unreadIds.length > 0) {
          await supabase
            .from('messages')
            .update({ is_read: true })
            .in('id', unreadIds);
        }
      }
      setLoading(false);
    };

    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel(`messages:${bookingId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `booking_id=eq.${bookingId}`,
        },
        async (payload) => {
          const newMessage = payload.new as Message;
          
          // Fetch sender name if not cached
          if (!profiles[newMessage.sender_id]) {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('full_name')
              .eq('user_id', newMessage.sender_id)
              .single();
            
            if (profileData) {
              setProfiles(prev => ({
                ...prev,
                [newMessage.sender_id]: profileData.full_name
              }));
            }
          }

          setMessages(prev => [...prev, newMessage]);

          // Mark as read if from someone else
          if (newMessage.sender_id !== user?.id) {
            await supabase
              .from('messages')
              .update({ is_read: true })
              .eq('id', newMessage.id);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [bookingId, user]);

  const handleSendMessage = async (content: string) => {
    if (!user || !bookingId) return;

    const { error } = await supabase.from('messages').insert({
      booking_id: bookingId,
      sender_id: user.id,
      content,
    });

    if (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Add sender names to messages
  const messagesWithNames = messages.map(m => ({
    ...m,
    sender_name: profiles[m.sender_id] || 'Unknown'
  }));

  if (!user) {
    return (
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Please log in to view messages.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-heading flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Messages
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <MessageList messages={messagesWithNames} loading={loading} />
        <MessageInput onSend={handleSendMessage} />
      </CardContent>
    </Card>
  );
}
