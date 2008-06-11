class PageController < ApplicationController
  include AuthenticatedSystem
  include DisplayHelper
  
  before_filter :store_location, :login_from_cookie
  
  def index
  end
  
  def summer_schedule_2008
    unit_height = 16.0
    unit_time = 30 * 60.0
    
    @section_path = "Adminitration &raquo; "
    @section_title = 'Summer Schedule Edit'
    
    @startdate = Date.new(2008, 6, 8)
    @enddate = Date.new(2008, 9, 2)
    
    @totaldays = (@enddate - @startdate).to_i
    @numberofweeks = (@totaldays / 7.0).ceil
    
    @students = SummerStudent.find(:all, :order => "name ASC")

    @student_lessons = {}
    @schedules = {}
    
    for student in @students
      @schedules[student] = SummerStudentSchedule.find(:all, :conditions => ["summer_student_id = ? and selected IS NOT NULL", student.id], :order => "selected ASC")
      
      lesson_list = []

      i = 1
      for schedule in @schedules[student]
        lesson_start = Time.local(schedule.selected.year, schedule.selected.month, schedule.selected.day, schedule.selected.hour, schedule.selected.min).to_i
        lesson_end = lesson_start + (schedule.summer_student.lesson_duration * 60)
        lesson_list << "<li>" + i.to_s + '. <a href="#lesson_' + lesson_start.to_s + '">' + Time.at(lesson_start).strftime("%a %b %d : %I:%M%p") + ' - ' + Time.at(lesson_end).strftime("%I:%M%p") + '</a></li>'
        i += 1
      end
      
      @student_lessons[student] = lesson_list.to_s
    end
    
    
    lesson_data = SummerStudentSchedule.find(:all, :conditions => ["selected IS NOT NULL"])


    @all_lessons = {}
    
    for data in lesson_data
      student = data.summer_student
      lesson_start = data.selected.to_time.to_i
      lesson_end = lesson_start + (student.lesson_duration * 60)
      block = (lesson_start - (lesson_start % 1800))
      @all_lessons[block] = {
        :offset => (((lesson_start - block) / unit_time) * unit_height).round,
        :duration => (((student.lesson_duration * 60) / unit_time) * unit_height).round,
        :string => "<a name=\"lesson_" + lesson_start.to_s + "\"></a><strong>#{student.name}</strong>: #{data.selected.strftime('%I:%M%p')} - #{Time.at(lesson_end).strftime('%I:%M%p')}",
        :schedule_id => data.id,
        :student_id => student.id
      }
    end
    
    
    @day_start = 7;
    @day_end   = 20;

    @teaching_hours = [{
      1 => [14, 20],
      2 => [19.5, 20],
      3 => [14, 19],
      4 => [14, 20],
      5 => [0, 0],
      :color => "#e2fde6"
    },{
      1 => [0, 0],
      2 => [0, 0],
      3 => [7.5, 11],
      4 => [7.5, 11],
      5 => [7.5, 11],
      :color => "#e6edf2"
    }]
    
    
    @colors = [
    				"CC3333",
    				"DD4477",
    				"994499",
    				"6633CC",
    				"336699",
    				"3366CC",
    				"22AA99",
    				"329262",
    				"0F9618",
    				"66AA00",
    				"AAAA11",
    				"D6AE00",
    				"EE8800",
    				"DD5511",
    				"A87070",
    				"8C6D8C",
    				"627487",
    				"7083A8",
    				"5C8D87",
    				"898951",
    				"B08B59" 
    ]
    
    @schedule = {
      Date.new(2008, 6, 10).yday => "",
      Date.new(2008, 6, 11).yday => "",
      Date.new(2008, 6, 12).yday => "",
      Date.new(2008, 6, 13).yday => "",
      Date.new(2008, 6, 14).yday => "",
      Date.new(2008, 6, 15).yday => "",
      Date.new(2008, 6, 16).yday => "",
        Date.new(2008, 6, 17).yday => "",
        Date.new(2008, 6, 18).yday => "",
        Date.new(2008, 6, 19).yday => "",
        Date.new(2008, 6, 20).yday => "",
        Date.new(2008, 6, 23).yday => "",
        Date.new(2008, 6, 24).yday => "",
        Date.new(2008, 6, 25).yday => "",
        Date.new(2008, 6, 26).yday => "",
        Date.new(2008, 6, 27).yday => "",
        Date.new(2008, 7, 7).yday => "",
        Date.new(2008, 7, 8).yday => "",
        Date.new(2008, 7, 9).yday => "",
        Date.new(2008, 7, 10).yday => "",
        Date.new(2008, 7, 11).yday => "",
        Date.new(2008, 7, 14).yday => "",
        Date.new(2008, 7, 15).yday => "",
        Date.new(2008, 7, 16).yday => "",
        Date.new(2008, 7, 17).yday => "",
        Date.new(2008, 7, 18).yday => "",
        Date.new(2008, 7, 21).yday => "",
        Date.new(2008, 7, 22).yday => "",
        Date.new(2008, 7, 23).yday => "",
        Date.new(2008, 7, 24).yday => "",
        Date.new(2008, 7, 25).yday => "",
        Date.new(2008, 7, 28).yday => "",
        Date.new(2008, 7, 29).yday => "",
        Date.new(2008, 7, 30).yday => "",
        Date.new(2008, 7, 31).yday => "",
        Date.new(2008, 8, 6).yday => "",
        Date.new(2008, 8, 7).yday => "",
        Date.new(2008, 8, 8).yday => "",
        Date.new(2008, 8, 14).yday => "",
        Date.new(2008, 8, 15).yday => "",
        Date.new(2008, 8, 18).yday => "",
        Date.new(2008, 8, 19).yday => "",
        Date.new(2008, 8, 20).yday => "",
        Date.new(2008, 8, 21).yday => "",
        Date.new(2008, 8, 22).yday => "",
        Date.new(2008, 8, 25).yday => "",
        Date.new(2008, 8, 26).yday => "",
        Date.new(2008, 8, 27).yday => "",
        Date.new(2008, 8, 28).yday => "",
        Date.new(2008, 8, 29).yday => "",
        Date.new(2008, 9, 2).yday => "",
    }
    
    
    
    
  end
  
  def jesuslovesme
    @section_title = "Music Downloads"
  end
  
  def illegal
    @section_title = "You can't do that!"
  end
  
end
