import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  AlertTriangle, 
  Eye, 
  EyeOff, 
  AtSign, 
  Sparkles, 
  Check 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const RoomChat = ({ roomId }) => {
  const { 
    messages, 
    sendRoomMessage, 
    users, 
    currentUser, 
    setViewingUserId, 
    setActiveTab, 
    setSelectedRoomId 
  } = useApp();

  const [inputText, setInputText] = useState('');
  const [isSpoiler, setIsSpoiler] = useState(false);
  const [spoilerRevealed, setSpoilerRevealed] = useState({}); // { [msgId]: boolean }
  const [mentionSuggestions, setMentionSuggestions] = useState([]);
  const messagesEndRef = useRef(null);

  const roomMessages = messages.filter(m => m.roomId === roomId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [roomMessages.length]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputText(val);

    // Simple @mention auto-detect
    const lastAt = val.lastIndexOf('@');
    if (lastAt !== -1 && lastAt === val.length - 1) {
      setMentionSuggestions(users.filter(u => u.id !== currentUser.id));
    } else {
      setMentionSuggestions([]);
    }
  };

  const handleSelectMention = (username) => {
    const lastAt = inputText.lastIndexOf('@');
    const newText = inputText.slice(0, lastAt) + `@${username} `;
    setInputText(newText);
    setMentionSuggestions([]);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    sendRoomMessage(roomId, {
      text: inputText,
      isSpoiler
    });

    setInputText('');
    setIsSpoiler(false);
    setMentionSuggestions([]);
  };

  const toggleMessageSpoiler = (msgId) => {
    setSpoilerRevealed(prev => ({
      ...prev,
      [msgId]: !prev[msgId]
    }));
  };

  const handleUserClick = (userId) => {
    setSelectedRoomId(null);
    setViewingUserId(userId);
    setActiveTab('profile');
  };

  return (
    <div className="room-chat-wrapper">
      {/* Scrollable Messages Area */}
      <div className="room-messages-scroll">
        {roomMessages.length === 0 ? (
          <div style={{ textAlign: 'center', margin: 'auto', color: 'var(--text-dim)' }}>
            <p>Bu odada henüz mesajlaşma başlamadı. İlk mesajı siz yazın!</p>
          </div>
        ) : (
          roomMessages.map(msg => {
            const sender = users.find(u => u.id === msg.userId) || {
              fullName: 'Okur',
              username: 'okur',
              avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80'
            };
            const isMe = msg.userId === currentUser.id;
            const isRevealed = !!spoilerRevealed[msg.id];

            return (
              <div key={msg.id} className={`chat-message-row ${isMe ? 'is-me' : ''}`}>
                <img
                  src={sender.avatar}
                  alt={sender.fullName}
                  className="chat-user-avatar"
                  onClick={() => handleUserClick(sender.id)}
                  title={`${sender.fullName} profiline git`}
                />

                <div className="chat-bubble-container">
                  <div className="chat-sender-header">
                    <span 
                      className="chat-sender-name" 
                      onClick={() => handleUserClick(sender.id)}
                    >
                      {sender.fullName}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                      {msg.timestamp}
                    </span>
                    {msg.isSpoiler && (
                      <span className="badge badge-spoiler" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>
                        Spoiler
                      </span>
                    )}
                  </div>

                  {/* Message Bubble with Spoiler handling */}
                  <div className="chat-bubble">
                    {msg.isSpoiler && !isRevealed ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-danger)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <AlertTriangle size={13} />
                          Gizli Spoiler Mesajı
                        </span>
                        <button
                          className="btn btn-secondary btn-sm"
                          style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                          onClick={() => toggleMessageSpoiler(msg.id)}
                        >
                          <Eye size={13} />
                          Spoileri Göster
                        </button>
                      </div>
                    ) : (
                      <div>
                        {/* Highlight @mentions in text */}
                        {msg.text.split(/(@\w+)/g).map((chunk, idx) => {
                          if (chunk.startsWith('@')) {
                            return (
                              <span 
                                key={idx} 
                                style={{ 
                                  color: isMe ? '#fff' : 'var(--color-primary)', 
                                  fontWeight: 700, 
                                  background: isMe ? 'rgba(0,0,0,0.15)' : 'var(--color-primary-light)',
                                  padding: '1px 4px',
                                  borderRadius: '4px'
                                }}
                              >
                                {chunk}
                              </span>
                            );
                          }
                          return chunk;
                        })}

                        {msg.spoilerText && (
                          <div style={{ marginTop: '6px', fontStyle: 'italic', borderLeft: '2px solid currentColor', paddingLeft: '8px' }}>
                            {msg.spoilerText}
                          </div>
                        )}

                        {msg.isSpoiler && isRevealed && (
                          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                            <button
                              style={{ background: 'none', border: 'none', color: 'currentColor', opacity: 0.7, fontSize: '0.7rem', cursor: 'pointer' }}
                              onClick={() => toggleMessageSpoiler(msg.id)}
                            >
                              Gizle
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Mention popup */}
      {mentionSuggestions.length > 0 && (
        <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', padding: '6px', maxHeight: '120px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', padding: '2px 8px' }}>Kullanıcı Etiketle:</div>
          {mentionSuggestions.map(u => (
            <div
              key={u.id}
              onClick={() => handleSelectMention(u.username)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 8px', borderRadius: '4px', cursor: 'pointer' }}
              className="hover-subtle"
            >
              <img src={u.avatar} alt="" style={{ width: '22px', height: '22px', borderRadius: '50%' }} />
              <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{u.fullName}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>@{u.username}</span>
            </div>
          ))}
        </div>
      )}

      {/* Input Bar */}
      <form onSubmit={handleSend} className="chat-input-bar">
        <div className="chat-input-tools">
          <label className={`chat-spoiler-toggle ${isSpoiler ? 'active' : ''}`}>
            <input
              type="checkbox"
              checked={isSpoiler}
              onChange={(e) => setIsSpoiler(e.target.checked)}
              style={{ accentColor: 'var(--color-danger)' }}
            />
            <AlertTriangle size={14} />
            Spoiler Olarak İşaretle
          </label>

          <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>
            İpucu: Kişi etiketlemek için @ yazın
          </span>
        </div>

        <div className="chat-input-row">
          <input
            type="text"
            placeholder={isSpoiler ? '⚠️ Spoiler içeren mesajınızı yazın...' : 'Kitap veya bölüm hakkında bir mesaj yazın...'}
            value={inputText}
            onChange={handleInputChange}
            className="chat-text-input"
            style={{
              borderColor: isSpoiler ? 'var(--color-danger)' : undefined
            }}
          />

          <button
            type="submit"
            className={`btn ${isSpoiler ? 'btn-danger' : 'btn-primary'}`}
            disabled={!inputText.trim()}
          >
            <Send size={16} />
          </button>
        </div>
      </form>
    </div>
  );
};
