-- Migration: Add solution and answer_hint columns, update data
ALTER TABLE mp_cases ADD COLUMN IF NOT EXISTS solution TEXT;
ALTER TABLE mp_cases ADD COLUMN IF NOT EXISTS answer_hint TEXT;

-- Update solution and answer_hint from existing data
UPDATE mp_cases SET
  solution = CASE id
    WHEN 1 THEN 'Bruno Freitas, o filho, usou a chave-mestra do prédio vizinho para entrar. A mudança no testamento que excluiria Marina foi o motivo: Roberto ia deixar tudo para uma fundação de caridade. O troféu de futebol era do time do filho, explicando a escolha da arma.'
    WHEN 2 THEN 'O Espelho Amaldiçoado foi uma farsa armada por Tiago para assustar a esposa e拿走 a apólice de seguro. Usou um sistema de iluminação dramática e um espelho tratado com produtos químicos para criar o efeito de "sangue".'
    ELSE solution
  END,
  answer_hint = CASE id
    WHEN 1 THEN 'Bruno tinha acesso ao prédio e uma discussão sobre herança horas antes.'
    WHEN 2 THEN 'Tiago tinha uma apólice de seguro vida recém-contratada.'
    ELSE answer_hint
  END;
