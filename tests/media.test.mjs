import test from 'node:test';
import assert from 'node:assert/strict';
import { validMedia, validKey } from '../media.mjs';

test('chaves e validação das fotos do backup', () => {
  assert.ok(validKey('ex:flexao') && validKey('pos:guarda_fechada') && validKey('tec:f-triangulo'));
  assert.ok(!validKey('ex:../x') && !validKey('foo:bar') && !validKey('ex:'));
  const img = 'data:image/jpeg;base64,/9j/4AAQSkZJRg==';
  assert.ok(validMedia(undefined));
  assert.ok(validMedia({ 'ex:flexao': [img, null], 'pos:montada': [img] }));
  assert.equal(validMedia({ 'ex:flexao': [null, null] }), false, 'sem nenhuma foto');
  assert.equal(validMedia({ 'ex:flexao': ['data:text/html;base64,PGI+'] }), false, 'não é imagem');
  assert.equal(validMedia({ 'x:y': [img] }), false, 'chave inválida');
  assert.equal(validMedia([]), false);
});
