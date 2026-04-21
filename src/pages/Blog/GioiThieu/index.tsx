import React from 'react';
import { Card, Avatar, Typography, Divider, Row, Col, Tag, Space } from 'antd';
import { GithubOutlined, LinkedinOutlined, TwitterOutlined, MailOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const GioiThieu = () => {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <Card style={{ textAlign: 'center' }}>
        <Avatar 
          size={120} 
          src="https://joeschmoe.io/api/v1/random" 
          style={{ marginBottom: 20 }}
        />
        <Title level={2}>Nguyễn Văn A</Title>
        <Text type="secondary" style={{ fontSize: 16 }}>
          Fullstack Developer | Content Creator | Tech Enthusiast
        </Text>

        <Divider />

        <Row gutter={[32, 32]} style={{ textAlign: 'left' }}>
          <Col xs={24} md={12}>
            <Title level={4}>Về tôi</Title>
            <Paragraph>
              Xin chào! Tôi là một lập trình viên đam mê với công nghệ web hiện đại. 
              Tôi thích viết mã sạch, tối ưu hóa hiệu suất và xây dựng các sản phẩm mang lại giá trị thực sự cho người dùng.
              Blog này là nơi tôi chia sẻ những kiến thức, kinh nghiệm và hành trình học tập của mình trong thế giới công nghệ.
            </Paragraph>
            <Space size="middle">
              <a href="https://github.com" target="_blank" rel="noreferrer"><GithubOutlined style={{ fontSize: 24, color: '#333' }} /></a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer"><LinkedinOutlined style={{ fontSize: 24, color: '#0077b5' }} /></a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer"><TwitterOutlined style={{ fontSize: 24, color: '#1da1f2' }} /></a>
              <a href="mailto:contact@example.com"><MailOutlined style={{ fontSize: 24, color: '#d44638' }} /></a>
            </Space>
          </Col>
          <Col xs={24} md={12}>
            <Title level={4}>Kỹ năng (Skills)</Title>
            <div style={{ marginBottom: 10 }}>
              <Text strong>Frontend: </Text>
              <br/>
              <Tag color="blue">React</Tag>
              <Tag color="cyan">Ant Design</Tag>
              <Tag color="geekblue">TypeScript</Tag>
              <Tag color="purple">Next.js</Tag>
            </div>
            <div style={{ marginBottom: 10 }}>
              <Text strong>Backend: </Text>
              <br/>
              <Tag color="green">Node.js</Tag>
              <Tag color="volcano">Express</Tag>
              <Tag color="magenta">NestJS</Tag>
              <Tag color="gold">Python</Tag>
            </div>
            <div style={{ marginBottom: 10 }}>
              <Text strong>Database & Tools: </Text>
              <br/>
              <Tag color="orange">MongoDB</Tag>
              <Tag color="red">PostgreSQL</Tag>
              <Tag color="lime">Docker</Tag>
              <Tag color="default">Git</Tag>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default GioiThieu;
