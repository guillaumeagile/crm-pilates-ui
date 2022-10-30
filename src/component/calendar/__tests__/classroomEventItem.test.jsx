import {render} from "../../../test-utils/test-utils";
import {screen} from "@testing-library/react";
import React from "react";
import {
    AttendeeBuilder,
    AttendeesBuilder,
    ScheduleBuilder,
    SessionBuilder
} from "../../../test-utils/classroom/session";
import userEvent from "@testing-library/user-event";
import {ClassroomEventItem} from "../ClassroomEventItem";
import {formatFullDate, formatHours} from "../../../utils/date";

describe.skip('Classroom Event', function () {

    it('should display classroom details when clicked', () => {
        const attendees = new AttendeesBuilder().withAttendee(new AttendeeBuilder()
            .id("1")
            .firstname("Laurent")
            .lastname("Gas")
            .noCredits()
            .build()).withAttendee(new AttendeeBuilder()
            .id("2")
            .firstname("Bertrand")
            .lastname("Bougon")
            .noCredits()
            .build()).build();
        const session_date = new Date();
        const classroomSession = new SessionBuilder()
            .withId("1")
            .withClassroom("2")
            .withName("Cours tapis")
            .withSchedule(new ScheduleBuilder(session_date)
                .build())
            .withPosition(3)
            .withAttendees(attendees)
            .build();
        render(<ClassroomEventItem session={classroomSession} displaySession={() => ({classroomSession})}/>)

        userEvent.click(screen.getByText("Cours tapis"))

        expect(screen.getByRole("tooltip")).toBeInTheDocument()
        expect(screen.getByText("Cours tapis", {selector: 'span'})).toBeInTheDocument()
        expect(screen.getByText(formatFullDate(classroomSession.schedule.start)
                .concat(` ${formatHours(classroomSession.schedule.start)}`)
                .concat(" to ")
                .concat(formatFullDate(classroomSession.schedule.stop))
                .concat(` ${formatHours(classroomSession.schedule.stop)}`)
            , {selector: 'span'})).toBeInTheDocument()
        expect(screen.getByText("Laurent Gas", {selector: 'p'})).toBeInTheDocument()
        expect(screen.getByText("0", {selector: 'span'})).toBeInTheDocument()
        expect(screen.getByText("Bertrand Bougon", {selector: 'p'})).toBeInTheDocument()
        expect(screen.getByText("5", {selector: 'span'})).toBeInTheDocument()
        expect(screen.getAllByText("R", {selector: 'span'})).toBeTruthy()
    })

    it('should display classroom details when clicked with expected attendee status', () => {
        const attendees = new AttendeesBuilder().withAttendee(new AttendeeBuilder()
            .id("1")
            .firstname("Bruno")
            .lastname("Germain")
            .noCredits()
            .build()).withAttendee(new AttendeeBuilder()
            .id("2")
            .firstname("Bertrand")
            .lastname("Bougon")
            .noCredits()
            .build()).build();
        const classroomSession = new SessionBuilder()
            .withSchedule(new ScheduleBuilder(new Date())
                .build())
            .withAttendees(attendees)
            .build();
        render(<ClassroomEventItem {...classroomSession}/>)

        userEvent.click(screen.getByText(classroomSession.name))

        expect(screen.getByText("R", {selector: 'span'})).toBeInTheDocument()
        expect(screen.getByText("C", {selector: 'span'})).toBeInTheDocument()
    })
})