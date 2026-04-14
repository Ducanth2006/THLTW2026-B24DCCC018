import { Table, Button, Input, message, Popconfirm, Space, Tag } from 'antd';
import React, { useState, useEffect } from 'react';
import FormKhoaHoc from './FormKhoaHoc';

const { Search } = Input;

// Định nghĩa kiểu dữ liệu để sửa lỗi never[] và implicit any của Typescript
interface KieuKhoaHoc {
	id: string;
	tenKhoaHoc: string;
	giangVien: string;
	soLuongHocVien: number;
	trangThai: string;
	moTa?: string;
}

const QuanLyKhoaHoc = () => {
	// Gắn <KieuKhoaHoc[]> vào useState để dẹp lỗi never[]
	const [dsKhoaHoc, setDsKhoaHoc] = useState<KieuKhoaHoc[]>([]);
	const [tuKhoaTimKiem, setTuKhoaTimKiem] = useState('');
	const [hienThiModal, setHienThiModal] = useState(false);
	const [duLieuDangSua, setDuLieuDangSua] = useState<KieuKhoaHoc | null>(null);

	useEffect(() => {
		const duLieuTuStorage = localStorage.getItem('danhSachKhoaHocOnline');
		if (duLieuTuStorage) {
			setDsKhoaHoc(JSON.parse(duLieuTuStorage));
		} else {
			const duLieuMacDinh: KieuKhoaHoc[] = [
				{
					id: 'KH01',
					tenKhoaHoc: 'Cấu trúc dữ liệu và giải thuật',
					giangVien: 'Thầy Phan Tiến',
					soLuongHocVien: 45,
					trangThai: 'Đang mở',
					moTa: '<p>Khóa học cơ bản</p>',
				},
				{
					id: 'KH02',
					tenKhoaHoc: 'An toàn bảo mật hệ thống',
					giangVien: 'Cô Mai',
					soLuongHocVien: 0,
					trangThai: 'Đã kết thúc',
					moTa: '<p>Nâng cao</p>',
				},
			];
			setDsKhoaHoc(duLieuMacDinh);
			localStorage.setItem('danhSachKhoaHocOnline', JSON.stringify(duLieuMacDinh));
		}
	}, []);

	const luuVaoStorage = (mangMoi: KieuKhoaHoc[]) => {
		setDsKhoaHoc(mangMoi);
		localStorage.setItem('danhSachKhoaHocOnline', JSON.stringify(mangMoi));
	};

	const bamXoaKhoaHoc = (id: string, soHocVien: number) => {
		if (soHocVien > 0) {
			message.error('Không được xóa khóa học đang có học viên tham gia nha');
			return;
		}
		const mangSauKhiXoa = dsKhoaHoc.filter((item) => item.id !== id);
		luuVaoStorage(mangSauKhiXoa);
		message.success('Xóa xong rồi');
	};

	const dongModalLai = () => {
		setHienThiModal(false);
		setDuLieuDangSua(null);
	};

	const bamSuaKhoaHoc = (dong: KieuKhoaHoc) => {
		setDuLieuDangSua(dong);
		setHienThiModal(true);
	};

	const xuLyLuuForm = (giaTriForm: any) => {
		if (duLieuDangSua) {
			const mangCapNhat = dsKhoaHoc.map((item) => (item.id === duLieuDangSua.id ? { ...item, ...giaTriForm } : item));
			luuVaoStorage(mangCapNhat);
			message.success('Cập nhật thành công');
		} else {
			const mangThemMoi = [...dsKhoaHoc, { ...giaTriForm, id: 'KH' + Math.floor(Math.random() * 10000) }];
			luuVaoStorage(mangThemMoi);
			message.success('Thêm mới thành công');
		}
		dongModalLai();
	};

	// Ép kiểu mảng cấu hình về any để đỡ phải khai báo phức tạp cho từng cột
	const cauHinhCotBang: any = [
		{ title: 'ID', dataIndex: 'id', key: 'id' },
		{
			title: 'Tên khóa học',
			dataIndex: 'tenKhoaHoc',
			key: 'tenKhoaHoc',
			filteredValue: [tuKhoaTimKiem],
			// Đã thêm kiểu cho value và record
			onFilter: (value: any, record: KieuKhoaHoc) =>
				String(record.tenKhoaHoc).toLowerCase().includes(String(value).toLowerCase()),
		},
		{
			title: 'Giảng viên',
			dataIndex: 'giangVien',
			key: 'giangVien',
			filters: [
				{ text: 'Thầy Phan Tiến', value: 'Thầy Phan Tiến' },
				{ text: 'Cô Mai', value: 'Cô Mai' },
				{ text: 'Thầy Hùng', value: 'Thầy Hùng' },
				{ text: 'Cô Lan', value: 'Cô Lan' },
				{ text: 'Thầy Tuấn', value: 'Thầy Tuấn' },
				{ text: 'Cô Hương', value: 'Cô Hương' },
				{ text: 'Thầy Nam', value: 'Thầy Nam' },
				{ text: 'Cô Trang', value: 'Cô Trang' },
			],
			onFilter: (value: any, record: KieuKhoaHoc) => record.giangVien === value,
		},
		{
			title: 'Số lượng học viên',
			dataIndex: 'soLuongHocVien',
			key: 'soLuongHocVien',
			sorter: (a: KieuKhoaHoc, b: KieuKhoaHoc) => a.soLuongHocVien - b.soLuongHocVien,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			key: 'trangThai',
			filters: [
				{ text: 'Đang mở', value: 'Đang mở' },
				{ text: 'Đã kết thúc', value: 'Đã kết thúc' },
				{ text: 'Tạm dừng', value: 'Tạm dừng' },
			],
			onFilter: (value: any, record: KieuKhoaHoc) => record.trangThai === value,
			render: (gt: string) => {
				let mauHienThi = gt === 'Đang mở' ? 'green' : gt === 'Tạm dừng' ? 'orange' : 'red';
				return <Tag color={mauHienThi}>{gt}</Tag>;
			},
		},
		{
			title: 'Hành động',
			key: 'action',
			render: (_: any, dongBang: KieuKhoaHoc) => (
				<Space>
					<Button type='primary' onClick={() => bamSuaKhoaHoc(dongBang)}>
						Sửa
					</Button>
					<Popconfirm
						title='Bạn có chắc muốn xóa khóa này không?'
						onConfirm={() => bamXoaKhoaHoc(dongBang.id, dongBang.soLuongHocVien)}
					>
						<Button danger>Xóa</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<div style={{ padding: '24px', backgroundColor: '#fff', minHeight: '100vh' }}>
			<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
				<Search
					placeholder='Nhập tên khóa học cần tìm...'
					onSearch={(val) => setTuKhoaTimKiem(val)}
					style={{ width: 400 }}
					allowClear
				/>
				<Button type='primary' onClick={() => setHienThiModal(true)}>
					Thêm khóa học mới
				</Button>
			</div>

			<Table dataSource={dsKhoaHoc} columns={cauHinhCotBang} rowKey='id' bordered />

			<FormKhoaHoc
				hienThi={hienThiModal}
				tatModal={dongModalLai}
				luuDuLieu={xuLyLuuForm}
				duLieuSua={duLieuDangSua}
				mangTong={dsKhoaHoc}
			/>
		</div>
	);
};

export default QuanLyKhoaHoc;
