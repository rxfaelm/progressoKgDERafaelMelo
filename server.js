const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// --- CONFIGURAÇÃO SUPABASE ---
const supabaseUrl = 'https://dncdeeywbbnaagluxsar.supabase.co'; 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRuY2RlZXl3YmJuYWFnbHV4c2FyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwNTkxNDgsImV4cCI6MjA4MzYzNTE0OH0.83HYuAYcsTBamEMp6otEvhef3clBsSeijLRasCYf8IQ'; 
const supabase = createClient(supabaseUrl, supabaseKey);

// BUSCAR REGISTROS (Mais recentes primeiro)
app.get('/registros', async (req, res) => {
    const { data, error } = await supabase
        .from('registros')
        .select('*')
        .order('data', { ascending: false }) // Garante que 43kg apareça antes de 42kg se for mais novo
        .order('id', { ascending: false }); // Desempate pelo ID

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// SALVAR REGISTRO
app.post('/salvar', async (req, res) => {
    const { peso, data, foco } = req.body;
    const { data: novo, error } = await supabase
        .from('registros')
        .insert([{ peso, data, foco: 'perder' }]) // Força o foco sempre como perder
        .select();

    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(novo[0]);
});

// DELETAR REGISTRO
app.delete('/deletar/:id', async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase
        .from('registros')
        .delete()
        .eq('id', id);

    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: "Registro deletado" });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));