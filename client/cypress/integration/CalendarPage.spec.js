/// <reference types="cypress" />
import moment from 'moment';

const setupIntercept = function () {
    // lectures info
    cy.fixture('list_of_lectures').as('lectures').then(function (lectures) {
        this.lectures = lectures;
        cy.intercept({ pathname: /\/api\/students\/[0-9]+\/lectures/ }, lectures);
    });
    // user info
    cy.fixture('student1').as('student').then(function (student) {
        this.student = student;
        cy.intercept('/api/user', { statusCode: 200, body: student});
        cy.intercept('/api/login', student);
    });
}
/*
 TODO:  here it seems that the beforeEach hook is not executed the first time.
        Try to make it work with a single hook
*/
beforeEach('intercept routes', function () {
    setupIntercept();
});
before('intercept routes', function () {
    setupIntercept();
});

describe('Student calendar', () => {
    before('change date to a suitable one', () => {
        cy.clock(Date.UTC(2020, 10, 17), ['Date']);
    });
    before('Visit calendar page', () => {
       cy.visit('/calendar');
    });
    before('Aliases', () => {
        /* DOM */
        cy.wrap('button[aria-label="prev"]').as('prev');
        cy.wrap('button[aria-label="next"]').as('next');
        cy.contains('today').as('today');
        cy.contains('week').as('week');
        cy.contains('list').as('list');
        cy.contains('month').as('month');
    });
    describe('Check empty calendar rendering', () => {
        it('should render navigation button', () => {
            cy.get ('@prev').should('exist');
            cy.get ('@next').should('exist');
            cy.get ('@today').should('exist').and('be.disabled');
            cy.get ('@week').should('exist');
            cy.get ('@list').should('exist');
            cy.get ('@month').should('exist');
        });
        it('should render headers', () => {
            const headerOfCurrentWeek = 'Nov 16 – 22, 2020';
            cy.contains(headerOfCurrentWeek).should('exist');
            cy.contains('Courses').should('exist');
        });
        it('should render calendar container', () => {
            const hours = [...Array(12).keys()].map(i=>i+8).map(h=>moment(h, 'h').format('ha'));    // get array of hours in 12h format
            const days = [...Array(7).keys()].map(h=>moment(h, 'd').format('ddd')); // get array of days in short format
            hours.forEach(h => cy.contains(h).should('exist'));
            days.forEach(d => cy.contains(d).should('exist'));
        });
    });
    describe('Check event boxes rendering', function () {
        it('should load course list in the right nav', function () {
            this.lectures.forEach(l => {
                cy.contains('Courses').parent().contains(l.course_name).should('exist');
                cy.contains('Courses').parent().contains(l.teacher_name).should('exist');
                cy.contains('Courses').parent().contains(l.teacher_surname).should('exist');
            });
            cy.contains('Courses').parent().find('[type="checkbox"]').should('be.checked');
        });
        it('should render list of this week lectures', function () {
            this.lectures.forEach(l => {
                cy.get('.calendar').contains(l.course_name).should('exist');
                cy.get('.calendar').contains(l.room_name).should('exist');
            });
            // TODO count based on this.lecture array
            cy.get('[data-cy=booking_status]:contains(booked)').should('have.length', 3);
            cy.get('[data-cy=booking_status]:contains(free)').should('have.length', 1);
            cy.get('[data-cy=booking_status]:contains(closed)').should('have.length', 1);
        });
        it('should hide course\'s lectures', function () {
            cy.contains('Courses').parent().find('[type="checkbox"]').first().uncheck();
            cy.get('.calendar').contains(this.lectures[0].course_name).should('not.exist');
        });
        it('should show again course\'s lectures', function () {
            cy.contains('Courses').parent().find('[type="checkbox"]').first().check();
            cy.get('.calendar').contains(this.lectures[0].course_name).should('exist');
        });
        it('should only show booked lectures', function () {
            cy.contains(/Show.*booked/).parent().find('[type="checkbox"]').should('exist').check();
            cy.get('.calendar').contains('closed').should('not.exist');
            cy.get('.calendar').contains('free').should('not.exist');
            // TODO count based on this.lecture array
            cy.get('[data-cy=booking_status]:contains(booked)').should('have.length', 3);
        });
        it('should show again all lectures', function () {
            cy.contains(/Show.*booked/).parent().find('[type="checkbox"]').should('exist').uncheck();
            // TODO count based on this.lecture array
            cy.get('[data-cy=booking_status]:contains(booked)').should('have.length', 3);
            cy.get('[data-cy=booking_status]:contains(free)').should('have.length', 1);
            cy.get('[data-cy=booking_status]:contains(closed)').should('have.length', 1);
        });
    });
});