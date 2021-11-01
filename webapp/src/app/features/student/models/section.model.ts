export interface Section extends SectionBase {
	id: string,
}

export interface SectionBase {
	sectionNumber: number,
	meetingDays: string,
	meetingTimeStart: string,
	meetingTimeEnd: string,
	classCapacity: number,
	waitlistCapacity: number,
	enrolledNumber: number,
	waitingNumber: number,
	dateStart: string,
	dateEnd: string,
	sectionStatus: string,
	courseId: string,
	buildingNumber: number,
	roomNumber: number,
	instructorLastName: string,
	instructorFirstName: string,
	courseCode: string,
	courseName: string,
	termName: string,
}
