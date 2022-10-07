import {Subjects} from "../../features/domain/subjects";
import {Attendee} from "../../features/domain/classroom";
import {Client} from "../../features/domain/client";
import {formatISO, intervalToDuration, parseISO, roundToNearestMinutes} from "date-fns";

export enum ActionType {
    CLASSROOM_NAME_CHANGED = "CLASSROOM_NAME_CHANGED",
    SUBJECT_CHANGED = "SUBJECT_CHANGED",
    POSITION_CHANGED = "POSITION_CHANGED",
    DURATION_UPDATED = "DURATION_UPDATED",
    ATTENDEES_UPDATED = "ATTENDEES_UPDATED",
    START_DATE_UPDATED = "START_DATE_UPDATED",
    END_DATE_UPDATED = "END_DATE_UPDATED",
}

export type SchedulingState = {
    currentDate: Date
    classroomName: string
    position: number
    subject?: Subjects | unknown
    duration: number
    classroomStartDateTime: string
    classroomEndDateTime: string
    attendees: Attendee[]
    availableDurations: { duration: number, human: string }[]
    availablePositions: number[]
    fieldsAreFilled: (state: SchedulingState) => boolean
}
type SchedulingAction =
    | {
    type: ActionType.CLASSROOM_NAME_CHANGED
    classroomName: string
}
    | {
    type: ActionType.SUBJECT_CHANGED
    subject: Subjects
} | {
    type: ActionType.POSITION_CHANGED
    position: number
}
    | {
    type: ActionType.DURATION_UPDATED
    duration: number
}
    | {
    type: ActionType.ATTENDEES_UPDATED
    attendees: Client[]
}
    | {
    type: ActionType.START_DATE_UPDATED
    startDate: Date
}
    | {
    type: ActionType.END_DATE_UPDATED
    endDate: Date
}

export function schedulingReducer(state: SchedulingState, action: SchedulingAction): SchedulingState {
    switch (action.type) {
        case ActionType.CLASSROOM_NAME_CHANGED:
            return {...state, classroomName: action.classroomName}
        case ActionType.SUBJECT_CHANGED:
            return {...state, subject: action.subject}
        case ActionType.POSITION_CHANGED:
            return {...state, position: action.position}
        case ActionType.DURATION_UPDATED:
            return {...state, duration: action.duration}
        case ActionType.ATTENDEES_UPDATED:
            return {
                ...state,
                attendees: action.attendees.map(attendee => ({id: attendee.id})),
                position: action.attendees.length > state.position ? action.attendees.length : state.position
            }
        case ActionType.START_DATE_UPDATED:
            return {...state, classroomStartDateTime: formatISO(action.startDate)}
        case ActionType.END_DATE_UPDATED:
            const {hours, minutes} = intervalToDuration({
                start: parseISO(state.classroomStartDateTime), end: roundToNearestMinutes(action.endDate, {nearestTo: 5})
            });
            if (hours) {
                const duration = hours * 60 + (minutes || 0);
                const foundAvailableDuration = state.availableDurations.find(availableDuration => availableDuration.duration === duration);
                if(!foundAvailableDuration) {
                    return {...state, classroomEndDateTime: formatISO(roundToNearestMinutes(action.endDate, {nearestTo: 5}))}
                }
                return {...state, duration, classroomEndDateTime: formatISO(roundToNearestMinutes(action.endDate, {nearestTo: 5}))}
            }
            return {...state, classroomEndDateTime: formatISO(action.endDate)}
    }
}

export function updateClassroomName(classroomName: string): SchedulingAction {
    return {classroomName, type: ActionType.CLASSROOM_NAME_CHANGED}
}

export function updateSubject(subject: Subjects): SchedulingAction {
    return {subject, type: ActionType.SUBJECT_CHANGED}
}

export function updatePosition(position: number): SchedulingAction {
    return {position, type: ActionType.POSITION_CHANGED}
}

export function updateDuration(duration: number): SchedulingAction {
    return {duration, type: ActionType.DURATION_UPDATED}
}

export function updateAttendees(attendees: Client[]): SchedulingAction {
    return {attendees, type: ActionType.ATTENDEES_UPDATED}
}

export function updateClassroomStartDate(startDate: Date): SchedulingAction {
    return {startDate, type: ActionType.START_DATE_UPDATED}
}

export function updateClassroomEndDate(endDate: Date): SchedulingAction {
    return {endDate, type: ActionType.END_DATE_UPDATED}
}