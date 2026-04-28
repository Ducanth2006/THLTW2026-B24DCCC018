import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import {
	Button,
	Card,
	DatePicker,
	Form,
	InputNumber,
	Modal,
	Popconfirm,
	Space,
	Table,
	Tag,
} from 'antd';
import moment, { type Moment } from 'moment';
import { useState } from 'react';
import {
	calcBmi,
	createId,
	formatDate,
	getBmiInfo,
	sortByDateDesc,
	type HealthItem,
	useFitnessStore,
} from '../data';
import '../style.less';

type HealthForm = {
	date: Moment;
	weight: number;
	height: number;
	restingHeartRate: number;
	sleepHours: number;
};

const Health = () => {
	const { store, setHealthLogs } = useFitnessStore();
	const [form] = Form.useForm<HealthForm>();
	const [open, setOpen] = useState(false);
	const [editingItem, setEditingItem] = useState<HealthItem | null>(null);
	const list = sortByDateDesc(store.healthLogs);

	const closeModal = () => {
		setOpen(false);
		setEditingItem(null);
		form.resetFields();
	};

	const openCreate = () => {
		setEditingItem(null);
		form.resetFields();
		form.setFieldsValue({
			date: moment(),
			weight: 69,
			height: 172,
			restingHeartRate: 70,
			sleepHours: 7,
		});
		setOpen(true);
	};

	const openEdit = (item: HealthItem) => {
		setEditingItem(item);
		form.setFieldsValue({
			date: moment(item.date),
			weight: item.weight,
			height: item.height,
			restingHeartRate: item.restingHeartRate,
			sleepHours: item.sleepHours,
		});
		setOpen(true);
	};

	const handleDelete = (id: string) => {
		setHealthLogs(store.healthLogs.filter((item) => item.id !== id));
	};

	const handleSubmit = async () => {
		const values = await form.validateFields();
		const nextItem: HealthItem = {
			id: editingItem?.id || createId(),
			date: values.date.toISOString(),
			weight: values.weight,
			height: values.height,
			restingHeartRate: values.restingHeartRate,
			sleepHours: values.sleepHours,
		};

		if (editingItem) {
			setHealthLogs(store.healthLogs.map((item) => (item.id === editingItem.id ? nextItem : item)));
		} else {
			setHealthLogs([nextItem, ...store.healthLogs]);
		}

		closeModal();
	};

	return (
		<div className='fitness-page'>
			<Card
				title='Nhật ký chỉ số sức khỏe'
				extra={
					<Button type='primary' icon={<PlusOutlined />} onClick={openCreate}>
						Thêm chỉ số
					</Button>
				}
			>
				<Table
					rowKey='id'
					dataSource={list}
					pagination={{ pageSize: 6 }}
					columns={[
						{
							title: 'Ngày',
							dataIndex: 'date',
							align: 'center',
							render: (value: string) => formatDate(value),
						},
						{
							title: 'Cân nặng (kg)',
							dataIndex: 'weight',
							align: 'center',
						},
						{
							title: 'Chiều cao (cm)',
							dataIndex: 'height',
							align: 'center',
						},
						{
							title: 'BMI',
							key: 'bmi',
							align: 'center',
							render: (_: unknown, item: HealthItem) => {
								const bmi = calcBmi(item.weight, item.height);
								const bmiInfo = getBmiInfo(bmi);
								return (
									<Space>
										<span>{bmi}</span>
										<Tag color={bmiInfo.color}>{bmiInfo.label}</Tag>
									</Space>
								);
							},
						},
						{
							title: 'Nhịp tim lúc nghỉ (bpm)',
							dataIndex: 'restingHeartRate',
							align: 'center',
						},
						{
							title: 'Giờ ngủ',
							dataIndex: 'sleepHours',
							align: 'center',
						},
						{
							title: 'Thao tác',
							key: 'action',
							align: 'center',
							render: (_: unknown, item: HealthItem) => (
								<Space>
									<Button type='link' icon={<EditOutlined />} onClick={() => openEdit(item)}>
										Sửa
									</Button>
									<Popconfirm title='Xóa chỉ số này?' onConfirm={() => handleDelete(item.id)}>
										<Button type='link' danger icon={<DeleteOutlined />}>
											Xóa
										</Button>
									</Popconfirm>
								</Space>
							),
						},
					]}
				/>
			</Card>

			<Modal
				destroyOnClose
				title={editingItem ? 'Sửa chỉ số sức khỏe' : 'Thêm chỉ số sức khỏe'}
				visible={open}
				onCancel={closeModal}
				onOk={handleSubmit}
			>
				<Form form={form} layout='vertical'>
					<Form.Item name='date' label='Ngày' rules={[{ required: true, message: 'Nhập ngày' }]}>
						<DatePicker style={{ width: '100%' }} format='DD/MM/YYYY' />
					</Form.Item>
					<Form.Item name='weight' label='Cân nặng (kg)' rules={[{ required: true, message: 'Nhập cân nặng' }]}>
						<InputNumber min={1} step={0.1} style={{ width: '100%' }} />
					</Form.Item>
					<Form.Item name='height' label='Chiều cao (cm)' rules={[{ required: true, message: 'Nhập chiều cao' }]}>
						<InputNumber min={1} style={{ width: '100%' }} />
					</Form.Item>
					<Form.Item
						name='restingHeartRate'
						label='Nhịp tim lúc nghỉ (bpm)'
						rules={[{ required: true, message: 'Nhập nhịp tim' }]}
					>
						<InputNumber min={1} style={{ width: '100%' }} />
					</Form.Item>
					<Form.Item name='sleepHours' label='Giờ ngủ' rules={[{ required: true, message: 'Nhập giờ ngủ' }]}>
						<InputNumber min={0} max={24} step={0.1} style={{ width: '100%' }} />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default Health;
