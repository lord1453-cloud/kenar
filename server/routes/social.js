import express from 'express';
import { db } from '../db/database.js';
import { requireAuth } from '../middleware/authAndPlatform.js';

const router = express.Router();

// --- GÖNDERİLER VE DÜŞÜNCELER (Posts / Thoughts) ---
router.get('/posts', (req, res) => {
  const posts = db.get('posts');
  res.json(posts);
});

router.post('/posts', requireAuth, (req, res) => {
  const { content, bookId, type, pageNumber, isSpoiler } = req.body;
  const platform = req.clientPlatform;

  if (!content || content.trim().length === 0) {
    return res.status(400).json({ error: 'Düşünce içeriği boş olamaz.' });
  }

  const newPost = {
    id: `post-${Date.now()}`,
    userId: req.user.id,
    content: content.trim(),
    type: type || 'thought', // 'thought' | 'quote' | 'review' | 'progress_update'
    bookId: bookId || null,
    pageNumber: pageNumber ? parseInt(pageNumber, 10) : null,
    isSpoiler: !!isSpoiler,
    likes: [],
    comments: [],
    platform: platform, // 'web' | 'ios' | 'android'
    createdAt: new Date().toISOString()
  };

  db.insert('posts', newPost);
  res.status(201).json({ success: true, post: newPost });
});

router.post('/posts/:id/like', requireAuth, (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const post = db.get('posts').find(p => p.id === id);
  if (!post) return res.status(404).json({ error: 'Gönderi bulunamadı.' });

  const hasLiked = (post.likes || []).includes(userId);
  const updatedLikes = hasLiked
    ? (post.likes || []).filter(uid => uid !== userId)
    : [...(post.likes || []), userId];

  const updated = db.update('posts', p => p.id === id, p => ({
    ...p,
    likes: updatedLikes
  }));

  res.json({ success: true, post: updated });
});

// --- ODALAR VE CANLI OKUMA (Rooms & Live Reading) ---
router.get('/rooms', (req, res) => {
  const rooms = db.get('rooms');
  res.json(rooms);
});

router.post('/rooms', requireAuth, (req, res) => {
  const { name, description, bookId, maxParticipants } = req.body;
  
  if (!name || name.trim().length === 0) {
    return res.status(400).json({ error: 'Oda adı zorunludur.' });
  }

  const newRoom = {
    id: `room-${Date.now()}`,
    name: name.trim(),
    description: description || 'Sessiz okuma odası',
    hostId: req.user.id,
    bookId: bookId || null,
    participants: [req.user.id],
    maxParticipants: maxParticipants || 15,
    status: 'active',
    isPrivate: false,
    ambientSound: 'none',
    createdAt: new Date().toISOString()
  };

  db.insert('rooms', newRoom);
  res.status(201).json({ success: true, room: newRoom });
});

router.get('/rooms/:id/messages', (req, res) => {
  const messages = db.get('messages').filter(m => m.roomId === req.params.id);
  res.json(messages);
});

router.post('/rooms/:id/messages', requireAuth, (req, res) => {
  const { content } = req.body;
  const { id } = req.params;

  if (!content || content.trim().length === 0) {
    return res.status(400).json({ error: 'Mesaj içeriği boş olamaz.' });
  }

  const newMessage = {
    id: `msg-${Date.now()}`,
    roomId: id,
    userId: req.user.id,
    content: content.trim(),
    platform: req.clientPlatform,
    timestamp: new Date().toISOString()
  };

  db.insert('messages', newMessage);
  res.status(201).json({ success: true, message: newMessage });
});

export default router;
