import moment, { type Moment } from 'moment';
import { useEffect, useState } from 'react';

export type WorkoutType = 'Cardio' | 'Strength' | 'Yoga' | 'HIIT' | 'Other';
export type WorkoutStatus = 'completed' | 'missed';
export type GoalType = 'Giảm cân' | 'Tăng cơ' | 'Cải thiện sức bền' | 'Khác';
export type GoalStatus = 'Đang thực hiện' | 'Đã đạt' | 'Đã hủy';
export type MuscleGroup = 'Chest' | 'Back' | 'Legs' | 'Shoulders' | 'Arms' | 'Core' | 'Full Body';
export type ExerciseLevel = 'Dễ' | 'Trung bình' | 'Khó';

export type WorkoutItem = {
	id: string;
	date: string;
	name: string;
	type: WorkoutType;
	duration: number;
	calories: number;
	note: string;
	status: WorkoutStatus;
};

export type HealthItem = {
	id: string;
	date: string;
	weight: number;
	height: number;
	restingHeartRate: number;
	sleepHours: number;
};

export type GoalItem = {
	id: string;
	name: string;
	type: GoalType;
	targetValue: number;
	currentValue: number;
	deadline: string;
	status: GoalStatus;
};

export type ExerciseItem = {
	id: string;
	name: string;
	muscleGroup: MuscleGroup;
	level: ExerciseLevel;
	description: string;
	instruction: string;
	caloriesPerHour: number;
};

type FitnessStore = {
	workouts: WorkoutItem[];
	healthLogs: HealthItem[];
	goals: GoalItem[];
	exercises: ExerciseItem[];
};

const storageKey = 'fitness-base-store';

const defaultData: FitnessStore = {
	workouts: [
		{
			id: 'w1',
			date: moment().subtract(1, 'day').toISOString(),
			name: 'Chay bo 5km',
			type: 'Cardio',
			duration: 40,
			calories: 320,
			note: 'Cam thay on dinh',
			status: 'completed',
		},
		{
			id: 'w2',
			date: moment().subtract(2, 'day').toISOString(),
			name: 'Tap ta than tren',
			type: 'Strength',
			duration: 55,
			calories: 410,
			note: 'Tang nhe muc ta',
			status: 'completed',
		},
		{
			id: 'w3',
			date: moment().subtract(3, 'day').toISOString(),
			name: 'Yoga co ban',
			type: 'Yoga',
			duration: 35,
			calories: 150,
			note: 'Tap gian co',
			status: 'completed',
		},
		{
			id: 'w4',
			date: moment().subtract(5, 'day').toISOString(),
			name: 'HIIT tai nha',
			type: 'HIIT',
			duration: 25,
			calories: 280,
			note: 'Bo lo 1 ngay truoc do',
			status: 'missed',
		},
		{
			id: 'w5',
			date: moment().subtract(7, 'day').toISOString(),
			name: 'Dap xe',
			type: 'Cardio',
			duration: 60,
			calories: 460,
			note: 'Tap ngoai troi',
			status: 'completed',
		},
		{
			id: 'w6',
			date: moment().subtract(10, 'day').toISOString(),
			name: 'Squat va lunge',
			type: 'Strength',
			duration: 45,
			calories: 330,
			note: '',
			status: 'completed',
		},
		{
			id: 'w7',
			date: moment().subtract(14, 'day').toISOString(),
			name: 'Di bo nhanh',
			type: 'Other',
			duration: 30,
			calories: 170,
			note: '',
			status: 'completed',
		},
	],
	healthLogs: [
		{
			id: 'h1',
			date: moment().subtract(28, 'day').toISOString(),
			weight: 70.8,
			height: 172,
			restingHeartRate: 76,
			sleepHours: 6.5,
		},
		{
			id: 'h2',
			date: moment().subtract(21, 'day').toISOString(),
			weight: 70.2,
			height: 172,
			restingHeartRate: 74,
			sleepHours: 7,
		},
		{
			id: 'h3',
			date: moment().subtract(14, 'day').toISOString(),
			weight: 69.9,
			height: 172,
			restingHeartRate: 72,
			sleepHours: 7.2,
		},
		{
			id: 'h4',
			date: moment().subtract(7, 'day').toISOString(),
			weight: 69.4,
			height: 172,
			restingHeartRate: 71,
			sleepHours: 7.5,
		},
		{
			id: 'h5',
			date: moment().toISOString(),
			weight: 69.1,
			height: 172,
			restingHeartRate: 70,
			sleepHours: 7.1,
		},
	],
	goals: [
		{
			id: 'g1',
			name: 'Giam 3kg trong 2 thang',
			type: 'Giảm cân',
			targetValue: 3,
			currentValue: 1.7,
			deadline: moment().add(45, 'day').toISOString(),
			status: 'Đang thực hiện',
		},
		{
			id: 'g2',
			name: 'Tap 16 buoi thang nay',
			type: 'Cải thiện sức bền',
			targetValue: 16,
			currentValue: 11,
			deadline: moment().endOf('month').toISOString(),
			status: 'Đang thực hiện',
		},
		{
			id: 'g3',
			name: 'Tang 5kg muc deadlift',
			type: 'Tăng cơ',
			targetValue: 5,
			currentValue: 5,
			deadline: moment().subtract(2, 'day').toISOString(),
			status: 'Đã đạt',
		},
	],
	exercises: [
		{
			id: 'e1',
			name: 'Push Up',
			muscleGroup: 'Chest',
			level: 'Dễ',
			description: 'Bai tap day nguc co ban.',
			instruction: 'Chong tay rong bang vai, ha nguoi xuong va day len deu.',
			caloriesPerHour: 420,
		},
		{
			id: 'e2',
			name: 'Pull Up',
			muscleGroup: 'Back',
			level: 'Khó',
			description: 'Bai tap keo xa cho lung va tay.',
			instruction: 'Nam xa don, keo nguoi len den khi cam vuot qua xa, ha xuong co kiem soat.',
			caloriesPerHour: 500,
		},
		{
			id: 'e3',
			name: 'Squat',
			muscleGroup: 'Legs',
			level: 'Trung bình',
			description: 'Bai tap chan co ban.',
			instruction: 'Dung chan rong bang vai, day hong ra sau, ha den khi dui gan song song mat dat.',
			caloriesPerHour: 380,
		},
		{
			id: 'e4',
			name: 'Shoulder Press',
			muscleGroup: 'Shoulders',
			level: 'Trung bình',
			description: 'Bai tap vai voi ta don hoac ta tay.',
			instruction: 'Bat dau o vi tri ngang vai, day ta len qua dau va ha xuong cham.',
			caloriesPerHour: 340,
		},
		{
			id: 'e5',
			name: 'Plank',
			muscleGroup: 'Core',
			level: 'Dễ',
			description: 'Giu co bung va than nguoi on dinh.',
			instruction: 'Chong khuyu tay, giu lung thang va sieu co bung trong suot bai tap.',
			caloriesPerHour: 250,
		},
		{
			id: 'e6',
			name: 'Burpee',
			muscleGroup: 'Full Body',
			level: 'Khó',
			description: 'Bai tap toan than cuong do cao.',
			instruction: 'Ha nguoi xuong plank, bat chan vao, dung len va nhay cao lien tuc.',
			caloriesPerHour: 700,
		},
	],
};

const readStore = (): FitnessStore => {
	if (typeof window === 'undefined') return defaultData;

	const rawValue = window.localStorage.getItem(storageKey);
	if (!rawValue) return defaultData;

	try {
		const parsedValue = JSON.parse(rawValue);
		return {
			workouts: parsedValue.workouts || defaultData.workouts,
			healthLogs: parsedValue.healthLogs || defaultData.healthLogs,
			goals: parsedValue.goals || defaultData.goals,
			exercises: parsedValue.exercises || defaultData.exercises,
		};
	} catch (error) {
		return defaultData;
	}
};

export const createId = () => `${Date.now()}${Math.floor(Math.random() * 1000)}`;

export const formatDate = (value: string) => moment(value).format('DD/MM/YYYY');

export const calcBmi = (weight: number, height: number) => {
	const meter = height / 100;
	if (!meter) return 0;
	return Number((weight / (meter * meter)).toFixed(1));
};

export const getBmiInfo = (bmi: number) => {
	if (bmi < 18.5) return { label: 'Thiếu cân', color: 'blue' };
	if (bmi < 25) return { label: 'Bình thường', color: 'green' };
	if (bmi < 30) return { label: 'Thừa cân', color: 'gold' };
	return { label: 'Béo phì', color: 'red' };
};

export const getGoalPercent = (item: GoalItem) => {
	if (!item.targetValue) return 0;
	return Math.min(100, Math.round((item.currentValue / item.targetValue) * 100));
};

export const useFitnessStore = () => {
	const [store, setStore] = useState<FitnessStore>(readStore);

	useEffect(() => {
		if (typeof window !== 'undefined') {
			window.localStorage.setItem(storageKey, JSON.stringify(store));
		}
	}, [store]);

	useEffect(() => {
		if (typeof window === 'undefined') return undefined;

		const handleStorage = () => {
			setStore(readStore());
		};

		window.addEventListener('storage', handleStorage);
		return () => window.removeEventListener('storage', handleStorage);
	}, []);

	return {
		store,
		setWorkouts: (list: WorkoutItem[]) => setStore((prev) => ({ ...prev, workouts: list })),
		setHealthLogs: (list: HealthItem[]) => setStore((prev) => ({ ...prev, healthLogs: list })),
		setGoals: (list: GoalItem[]) => setStore((prev) => ({ ...prev, goals: list })),
		setExercises: (list: ExerciseItem[]) => setStore((prev) => ({ ...prev, exercises: list })),
	};
};

export const sortByDateDesc = <T extends { date: string }>(list: T[]) => {
	return [...list].sort((a, b) => moment(b.date).valueOf() - moment(a.date).valueOf());
};

export const inRange = (value: string, range: [Moment, Moment] | null) => {
	if (!range) return true;
	const current = moment(value);
	return current.isBetween(range[0].startOf('day'), range[1].endOf('day'), undefined, '[]');
};
