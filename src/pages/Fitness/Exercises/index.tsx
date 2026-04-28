import {
	DeleteOutlined,
	EditOutlined,
	EyeOutlined,
	PlusOutlined,
	SearchOutlined,
} from '@ant-design/icons';
import {
	Button,
	Card,
	Col,
	Form,
	Input,
	InputNumber,
	Modal,
	Popconfirm,
	Row,
	Select,
	Space,
	Tag,
} from 'antd';
import { useState } from 'react';
import {
	createId,
	type ExerciseItem,
	type ExerciseLevel,
	type MuscleGroup,
	useFitnessStore,
} from '../data';
import '../style.less';

const muscleOptions: MuscleGroup[] = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Full Body'];
const levelOptions: ExerciseLevel[] = ['Dễ', 'Trung bình', 'Khó'];

type ExerciseForm = {
	name: string;
	muscleGroup: MuscleGroup;
	level: ExerciseLevel;
	description: string;
	instruction: string;
	caloriesPerHour: number;
};

const Exercises = () => {
	const { store, setExercises } = useFitnessStore();
	const [form] = Form.useForm<ExerciseForm>();
	const [keyword, setKeyword] = useState('');
	const [muscleValue, setMuscleValue] = useState<MuscleGroup | undefined>();
	const [levelValue, setLevelValue] = useState<ExerciseLevel | undefined>();
	const [openForm, setOpenForm] = useState(false);
	const [openDetail, setOpenDetail] = useState(false);
	const [editingItem, setEditingItem] = useState<ExerciseItem | null>(null);
	const [detailItem, setDetailItem] = useState<ExerciseItem | null>(null);

	const list = store.exercises.filter((item) => {
		const matchName = item.name.toLowerCase().includes(keyword.trim().toLowerCase());
		const matchMuscle = muscleValue ? item.muscleGroup === muscleValue : true;
		const matchLevel = levelValue ? item.level === levelValue : true;
		return matchName && matchMuscle && matchLevel;
	});

	const closeForm = () => {
		setOpenForm(false);
		setEditingItem(null);
		form.resetFields();
	};

	const openCreate = () => {
		setEditingItem(null);
		form.resetFields();
		form.setFieldsValue({
			muscleGroup: 'Chest',
			level: 'Dễ',
			caloriesPerHour: 300,
		});
		setOpenForm(true);
	};

	const openEdit = (item: ExerciseItem) => {
		setEditingItem(item);
		form.setFieldsValue({
			name: item.name,
			muscleGroup: item.muscleGroup,
			level: item.level,
			description: item.description,
			instruction: item.instruction,
			caloriesPerHour: item.caloriesPerHour,
		});
		setOpenForm(true);
	};

	const openView = (item: ExerciseItem) => {
		setDetailItem(item);
		setOpenDetail(true);
	};

	const handleDelete = (id: string) => {
		setExercises(store.exercises.filter((item) => item.id !== id));
	};

	const handleSubmit = async () => {
		const values = await form.validateFields();
		const nextItem: ExerciseItem = {
			id: editingItem?.id || createId(),
			name: values.name,
			muscleGroup: values.muscleGroup,
			level: values.level,
			description: values.description,
			instruction: values.instruction,
			caloriesPerHour: values.caloriesPerHour,
		};

		if (editingItem) {
			setExercises(store.exercises.map((item) => (item.id === editingItem.id ? nextItem : item)));
		} else {
			setExercises([nextItem, ...store.exercises]);
		}

		closeForm();
	};

	return (
		<div className='fitness-page'>
			<Card>
				<div className='fitness-toolbar'>
					<div className='fitness-toolbar-left'>
						<Input
							allowClear
							prefix={<SearchOutlined />}
							placeholder='Tim ten bai tap'
							value={keyword}
							onChange={(event) => setKeyword(event.target.value)}
							style={{ width: 220 }}
						/>
						<Select
							allowClear
							placeholder='Nhom co'
							value={muscleValue}
							onChange={setMuscleValue}
							style={{ width: 180 }}
						>
							{muscleOptions.map((item) => (
								<Select.Option key={item} value={item}>
									{item}
								</Select.Option>
							))}
						</Select>
						<Select
							allowClear
							placeholder='Muc do'
							value={levelValue}
							onChange={setLevelValue}
							style={{ width: 160 }}
						>
							{levelOptions.map((item) => (
								<Select.Option key={item} value={item}>
									{item}
								</Select.Option>
							))}
						</Select>
					</div>
					<Button type='primary' icon={<PlusOutlined />} onClick={openCreate}>
						Thêm bài tập
					</Button>
				</div>

				<Row gutter={[16, 16]}>
					{list.map((item) => (
						<Col xs={24} md={12} xl={8} key={item.id}>
							<Card
								className='fitness-exercise-card'
								title={item.name}
								hoverable
								actions={[
									<EyeOutlined key='view' onClick={() => openView(item)} />,
									<EditOutlined key='edit' onClick={() => openEdit(item)} />,
									<Popconfirm key='delete' title='Xóa bài tập này?' onConfirm={() => handleDelete(item.id)}>
										<DeleteOutlined />
									</Popconfirm>,
								]}
							>
								<Space direction='vertical' size={12} style={{ width: '100%' }}>
									<Space wrap>
										<Tag color='blue'>{item.muscleGroup}</Tag>
										<Tag color={item.level === 'Dễ' ? 'green' : item.level === 'Trung bình' ? 'gold' : 'red'}>
											{item.level}
										</Tag>
									</Space>
									<div className='fitness-card-note'>{item.description}</div>
									<div>Calo đốt trung bình/giờ: {item.caloriesPerHour}</div>
								</Space>
							</Card>
						</Col>
					))}
				</Row>
			</Card>

			<Modal
				destroyOnClose
				title={editingItem ? 'Sửa bài tập' : 'Thêm bài tập'}
				visible={openForm}
				onCancel={closeForm}
				onOk={handleSubmit}
			>
				<Form form={form} layout='vertical'>
					<Form.Item name='name' label='Tên bài tập' rules={[{ required: true, message: 'Nhập tên bài tập' }]}>
						<Input />
					</Form.Item>
					<Form.Item name='muscleGroup' label='Nhóm cơ tác động' rules={[{ required: true, message: 'Chọn nhóm cơ' }]}>
						<Select>
							{muscleOptions.map((item) => (
								<Select.Option key={item} value={item}>
									{item}
								</Select.Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item name='level' label='Mức độ khó' rules={[{ required: true, message: 'Chọn mức độ' }]}>
						<Select>
							{levelOptions.map((item) => (
								<Select.Option key={item} value={item}>
									{item}
								</Select.Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item name='description' label='Mô tả ngắn' rules={[{ required: true, message: 'Nhập mô tả' }]}>
						<Input.TextArea rows={2} />
					</Form.Item>
					<Form.Item name='instruction' label='Hướng dẫn đầy đủ' rules={[{ required: true, message: 'Nhập hướng dẫn' }]}>
						<Input.TextArea rows={4} />
					</Form.Item>
					<Form.Item
						name='caloriesPerHour'
						label='Calo đốt trung bình/giờ'
						rules={[{ required: true, message: 'Nhập calo' }]}
					>
						<InputNumber min={0} style={{ width: '100%' }} />
					</Form.Item>
				</Form>
			</Modal>

			
		</div>
	);
};

export default Exercises;
