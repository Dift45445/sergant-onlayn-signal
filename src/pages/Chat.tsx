
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send } from 'lucide-react';

interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: Date;
  isMe: boolean;
}

const Chat: React.FC = () => {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "Диспетчер Центра",
      text: "Добрый день, оперативная группа на связи.",
      timestamp: new Date(Date.now() - 1000 * 60 * 10),
      isMe: false
    },
    {
      id: "2",
      sender: "Вы",
      text: "Получил сообщение о происшествии на ул. Ленина. Выдвигаюсь на место.",
      timestamp: new Date(Date.now() - 1000 * 60 * 9),
      isMe: true
    },
    {
      id: "3",
      sender: "Диспетчер Центра",
      text: "Принято. Держите нас в курсе ситуации. Вам в помощь направлена дополнительная группа.",
      timestamp: new Date(Date.now() - 1000 * 60 * 8),
      isMe: false
    }
  ]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        sender: "Вы",
        text: newMessage,
        timestamp: new Date(),
        isMe: true
      };
      
      setMessages([...messages, message]);
      setNewMessage("");
      
      // Simulate response after a short delay
      setTimeout(() => {
        const response: Message = {
          id: (Date.now() + 1).toString(),
          sender: "Диспетчер Центра",
          text: "Сообщение получено, информация передана в соответствующие службы.",
          timestamp: new Date(),
          isMe: false
        };
        setMessages(prev => [...prev, response]);
      }, 2000);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Чат</h1>
        <p className="text-muted-foreground">Общение с диспетчерской службой</p>
      </div>
      
      <Card className="mb-4">
        <CardContent className="p-0">
          <div className="h-[500px] flex flex-col">
            <div className="bg-police-blue text-white p-4 flex items-center">
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src="" />
                <AvatarFallback className="bg-police-lightblue">ДЦ</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">Диспетчерский Центр</div>
                <div className="text-xs text-police-gray/80">Онлайн</div>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(message => (
                <div 
                  key={message.id} 
                  className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.isMe 
                        ? 'bg-police-blue text-white rounded-br-none' 
                        : 'bg-gray-100 rounded-bl-none'
                    }`}
                  >
                    <div className="font-medium text-sm">
                      {message.sender}
                    </div>
                    <div className="text-sm mt-1">{message.text}</div>
                    <div className={`text-xs mt-1 ${message.isMe ? 'text-police-gray/80' : 'text-gray-500'}`}>
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <Textarea 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Введите сообщение..."
                  className="resize-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button onClick={handleSendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Chat;
