import { Card, InputNumber, Button, Typography, Space } from 'antd';
import { useState, useEffect } from 'react';

const { Title, Paragraph } = Typography;

export default function GuessNumberGame() {
  const [soTajnen, setSoTajnen] = useState(0);
  const [so_nhap_vao, setSo_nhap_vao] = useState(0);
  const [so_lan_doan, setSo_lan_doan] = useState(0);
  const [thong_bao, setThong_bao] = useState('');
  const [trang_thai_game, setTrang_thai_game] = useState('dang_choi');

  useEffect(() => {
    tao_so_moi();
  }, []);

  const tao_so_moi = () => {
    const so_random = Math.floor(Math.random() * 100) + 1;
    setSoTajnen(so_random);
  };

  const doan_so = () => {
    if (so_nhap_vao === 0) {
      setThong_bao('Các bạn phải nhập số đi!');
      return;
    }

    const lan_moi = so_lan_doan + 1;
    setSo_lan_doan(lan_moi);

    if (so_nhap_vao < soTajnen) {
      setThong_bao('Bạn đoán Quá thấp rồi!');
    }
    if (so_nhap_vao > soTajnen) {
      setThong_bao('Bạn đoán Quá cao rồi!');
    }
    if (so_nhap_vao === soTajnen) {
      setThong_bao('Đúng rồi! Chúc mừng!');
      setTrang_thai_game('thang');
    }

    if (lan_moi >= 10 && so_nhap_vao !== soTajnen) {
      setThong_bao('Bạn hết lượt rồi ! Số đúng là: ' + soTajnen);
      setTrang_thai_game('thua');
    }

    setSo_nhap_vao(0);
  };

  const choi_lai = () => {
    tao_so_moi();
    setSo_nhap_vao(0);
    setSo_lan_doan(0);
    setThong_bao('');
    setTrang_thai_game('dang_choi');
  };

  return (
    <div>
      <Card>
        <Title level={2}>Đoán Số</Title>

        <Paragraph>Hãy đoán số từ 1 đến 100. Bạn có 10 lượt.</Paragraph>

        <Paragraph>Lượt hiện tại: {so_lan_doan}/10</Paragraph>

        {trang_thai_game === 'dang_choi' && (
          <Space direction="vertical">
            <InputNumber
              min={1}
              max={100}
              value={so_nhap_vao}
              onChange={(value) => setSo_nhap_vao(value || 0)}
              placeholder="Nhập số"
            />

            <Button type="primary" onClick={doan_so}>
              Đoán
            </Button>

            {thong_bao && <Paragraph>{thong_bao}</Paragraph>}
          </Space>
        )}

        {trang_thai_game === 'thang' && (
          <div>
            <Paragraph>{thong_bao}</Paragraph>
            <Button type="primary" onClick={choi_lai}>
              Chơi lại
            </Button>
          </div>
        )}

        {trang_thai_game === 'thua' && (
          <div>
            <Paragraph>{thong_bao}</Paragraph>
            <Button type="primary" onClick={choi_lai}>
              Chơi lại
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
