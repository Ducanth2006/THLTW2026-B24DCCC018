import React, { useState } from 'react';
import './OanTuTi.less';

export default function OanTuTi() {
  const [ketQua, setKetQua] = useState('');
  const [lichSuGame, setLichSuGame] = useState('');
  const [resultType, setResultType] = useState('');

  function choi(nguoiChon: string) {
    const luaChon = Math.floor(Math.random() * 3);
    let mayChon;
    if (luaChon === 0) mayChon = 'Kéo';
    else if (luaChon === 1) mayChon = 'Búa';
    else mayChon = 'Bao';
    let kq;
    if (nguoiChon === mayChon) {
      kq = 'Hòa';
    } else {
      if (nguoiChon === 'Kéo') {
        if (mayChon === 'Bao') kq = 'Bạn thắng';
        else kq = 'Bạn thua';
      } else if (nguoiChon === 'Búa') {
        if (mayChon === 'Kéo') kq = 'Bạn thắng';
        else kq = 'Bạn thua';
      } else if (nguoiChon === 'Bao') {
        if (mayChon === 'Búa') kq = 'Bạn thắng';
        else kq = 'Bạn thua';
      }
    }
    setKetQua('Bạn chọn ' + nguoiChon + ', máy chọn ' + mayChon + ' => ' + kq);
    setLichSuGame(lichSuGame + '\n' + ketQua + '\n');
    if (kq === 'Bạn thắng') setResultType('win');
    else if (kq === 'Bạn thua') setResultType('lose');
    else setResultType('draw');
  }

  return (
    <div className="oan-container">
      <div className="oan-buttons">
        <button onClick={() => choi('Kéo')}>Kéo</button>
        <button onClick={() => choi('Búa')}>Búa</button>
        <button onClick={() => choi('Bao')}>Bao</button>
      </div>
      <div id="divKetQua" className={"oan-result " + (resultType ? 'oan-' + resultType : '')}>
        Kết quả:
        {ketQua}
      </div>
      <pre id="lichSuGame" className="oan-history">
        Lịch sử Chơi:
        {lichSuGame}
      </pre>
    </div>
  );
}
