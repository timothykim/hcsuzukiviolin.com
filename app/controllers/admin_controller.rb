class AdminController < ApplicationController
#  include AuthenticatedSystem

  before_filter :store_location
#  before_filter :login_from_cookie
  before_filter :login_required
  before_filter :admin_required


  def global_submenu
    [
      { :name => '<img src="/images/icons/users.png" class="icon" /> Users', :link => "/admin/user", :selected => "selected" },
      { :name => '<img src="/images/icons/face-smile.png" class="icon" /> Students', :link => "/admin/student" },
      { :name => '<img src="/images/icons/home.png" class="icon" /> Schools', :link => "/admin/school" },
      { :name => '<img src="/images/icons/globe.png" class="icon" /> Locations', :link => "/admin/location" },
      { :name => '<img src="/images/icons/calendar.png" class="icon" /> Sessions', :link => "/admin/session" },
      { :name => '<img src="/images/icons/music.png" class="icon" /> Lessons', :link => "/admin/lesson" },
      { :name => '<img src="/images/icons/write.png" class="icon" /> Registrations', :link => "/admin/registration" },
      # { :name => '<img src="/images/icons/write.png" class="icon" /> CHMS Registrations', :link => "/admin/chms_registration" },
      { :name => '<img src="/images/icons/contact.png" class="icon" /> SBC Registrations', :link => "/admin/sbc" },
      { :name => '<img src="/images/icons/timesheet.png" class="icon" /> Timesheets', :link => "/admin/timesheet" },
      # { :name => '<img src="/images/icons/globe.png" class="icon" /> Site', :link => "#" },
      # { :name => '<img src="/images/icons/announce.png" class="icon" /> Announcements', :link => "#" },
      # { :name => '<img src="/images/icons/news.png" class="icon" /> Newsletter', :link => "#" }
    ]
  end

  def index
    @section_title = "Administration"
    @submenu = global_submenu
  end
  
#below is all legacy stuff
=begin
  def calendar
    if params[:calendar]
      
    end
  end
  
  def summer
    @section_path = "Adminitration &raquo; "
    @section_title = 'Summer Schedule'
    
    @submenu = global_submenu
    
    @students = SummerStudent.find(:all, :order => "name ASC")
  end
  
  def summer_lesson_add
    session[:return_to] = ""
    
    unit_height = 16.0
    unit_time = 30 * 60.0

    event = SummerStudentSchedule.find(params[:schedule_id])
    update = false
    unless event.selected.nil?
      update = true
      prev = Time.local(event.selected.year, event.selected.month, event.selected.day, event.selected.hour, event.selected.min).to_i
      prev_block = (prev - (prev % 1800))
    end
    today = event.begin
    lesson = DateTime.strptime("#{today.month}/#{today.day}/#{today.year} #{params[:time]} #{today.strftime('%z')}", "%m/%d/%Y %I:%M%p %z")
    event.selected = lesson
    event.save
    
    lesson_start = Time.local(lesson.year, lesson.month, lesson.day, lesson.hour, lesson.min).to_i
    lesson_end = lesson_start + (event.summer_student.lesson_duration * 60)
    
    block = (lesson_start - (lesson_start % 1800))
    student = event.summer_student

    image_blocks = []
    for e in SummerStudentSchedule.find(:all, :conditions => ["summer_student_id = ? and begin >= ? and begin < ?", event.summer_student.id, DateTime.new(event.begin.year, event.begin.month, event.begin.day), DateTime.new(event.begin.year, event.begin.month, event.begin.day, 24) ], :order => "selected ASC")
      image_blocks << 't' + (e.begin.to_time.to_i - (e.begin.to_time.to_i % 1800)).to_s
    end

    data = {
      :block => 't' + block.to_s,
      :offset => (((lesson_start - block) / unit_time) * unit_height).round,
      :duration => (((student.lesson_duration * 60) / unit_time) * unit_height).round,
      :string => "<a name=\"lesson_" + lesson_start.to_s + "\"></a><strong>#{student.name}</strong>: #{event.selected.strftime('%I:%M%p')} - #{Time.at(lesson_end).strftime('%I:%M%p')} | <a href=\"#\" onclick=\"if (confirm('Are you sure you want to delete this lesson?')) { new Ajax.Request('/admin/summer_lesson_delete/" + event.id.to_s + "', {asynchronous:true, evalScripts:true, onComplete:function(request){Effect.Fade($('t" + block.to_s + "').down('div'), {duration: 0.5, afterFinish: function() { $('t" + block.to_s + "').down('div').remove() }}); var count = $('lesson_count_" + student.id.to_s + "').down('a'); count.update(parseInt(count.innerHTML) - 1); render_schedule_day(" + student.id.to_s + ", '" + today.strftime("%Y/%m/%d") + "');}, parameters:'authenticity_token=' + encodeURIComponent('" + form_authenticity_token + "')}); }; return false;\" style=\"color: #700;\">x</a>",
      :schedule_id => event.id,
      :student_id => student.id,
      :update => update,
      :prev_block => 't' + prev_block.to_s,
      :image_blocks => image_blocks
    }

    render :text => data.to_json
  end
  
  def summer_lesson_delete
    if params[:id]
      schedule = SummerStudentSchedule.find(params[:id])
      
      schedule.selected = nil
      schedule.save
    end
    
    render :nothing => true
  end
  
  def get_lesson_list_json
    session[:return_to] = ""
    headers["Content-Type"] = "text/x-json; charset=utf-8"
    
    schedules = SummerStudentSchedule.find(:all, :conditions => ["summer_student_id = ? and selected IS NOT NULL", params[:id]], :order => "selected ASC")
    
    lesson_list = []
    
    i = 1
    for schedule in schedules 
      lesson_start = Time.local(schedule.selected.year, schedule.selected.month, schedule.selected.day, schedule.selected.hour, schedule.selected.min).to_i
      lesson_end = lesson_start + (schedule.summer_student.lesson_duration * 60)
      lesson_list << i.to_s + '. <a href="#lesson_' + lesson_start.to_s + '">' + Time.at(lesson_start).strftime("%a %b %d : %I:%M%p") + ' - ' + Time.at(lesson_end).strftime("%I:%M%p") + '</a>'
      i += 1
    end
    
    data = { :lessons => lesson_list }
    
    render :text => data.to_json
    
  end
  
  def summer_student_json
    session[:return_to] = ""
    
    headers["Content-Type"] = "text/x-json; charset=utf-8"
    
    student = SummerStudent.find(params[:id])
    
    if params[:day]
      day = DateTime.strptime("#{params[:day]}", "%Y/%m/%d")
      schedules = SummerStudentSchedule.find(:all, :conditions => ["summer_student_id = ? and selected IS NULL and begin >= ? and begin < ?", params[:id], DateTime.new(day.year, day.month, day.day), DateTime.new(day.year, day.month, day.day, 24)],  :order => "selected ASC")
    else
      schedules = SummerStudentSchedule.find(:all, :conditions => ["summer_student_id = ? and selected IS NULL", params[:id]], :order => "selected ASC")
    end


    events = []
    for event in schedules
      
      if SummerStudentSchedule.find(:all, :conditions => ["summer_student_id = ? and selected IS NOT NULL and begin >= ? and begin < ?", params[:id], DateTime.new(event.begin.year, event.begin.month, event.begin.day), DateTime.new(event.begin.year, event.begin.month, event.begin.day, 24) ], :order => "selected ASC").size == 0
      
        str = "#{event.begin.strftime('%I:%M%p')} - #{event.end.strftime('%I:%M%p')}";
      
        start, finish = event.begin.to_time.to_i, event.end.to_time.to_i
      
        today_begin = Time.local(event.begin.year, event.begin.month, event.begin.day, params[:day_start].to_i)
        today_end = Time.local(event.end.year, event.end.month, event.end.day, params[:day_end].to_i)
      
        if event.begin.hour < params[:day_start].to_i
          start = today_begin.to_i
        end
      
        events << {:start => start, :finish => finish, :string => str, :schedule_id => event.id, :selected => event.selected } unless (finish < today_begin.to_i)
      end
    end
    
    data = { :events => events, :name => student.name, :duration => student.lesson_duration }

    render :text => data.to_json
  end
  
  def summer_schedule_ical
    headers["Content-Type"] = "text/calendar; charset=utf-8"
    
    ical = <<END_OF_STRING
BEGIN:VCALENDAR
METHOD:PUBLISH
X-WR-TIMEZONE:US/Eastern
PRODID:-//GWSMS.//Summer Calendar//EN
X-WR-CALNAME:Summer 2008
VERSION:2.0
END_OF_STRING

    schedules = SummerStudentSchedule.find(:all, :conditions => ["selected IS NOT NULL"], :order => "selected ASC")
    
    for lesson in schedules
      startstr = lesson.selected.strftime("%Y%m%dT%H%M00")
      finishstr = Time.at(lesson.selected.to_time.to_i + (lesson.summer_student.lesson_duration * 60)).strftime("%Y%m%dT%H%M00")
      event_str = <<END_OF_EVENT
BEGIN:VEVENT
DTSTART;TZID=US/Eastern:#{startstr}
SUMMARY:#{lesson.summer_student.name}
DTEND;TZID=US/Eastern:#{finishstr}
END:VEVENT
END_OF_EVENT
      ical += event_str
    end

    ical += "END:VCALENDAR"

    render :text => ical
  end
  
  def summer_schedule
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
    
    for student in @students
      @student_lessons[student] = SummerStudentSchedule.find(:all, :conditions => ["summer_student_id = ? and selected IS NOT NULL", student.id])
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
        :string => "<a name=\"lesson_" + lesson_start.to_s + "\"></a><strong>#{student.name}</strong>: #{data.selected.strftime('%I:%M%p')} - #{Time.at(lesson_end).strftime('%I:%M%p')} | <a href=\"#\" onclick=\"if (confirm('Are you sure you want to delete this lesson?')) { new Ajax.Request('/admin/summer_lesson_delete/" + data.id.to_s + "', {asynchronous:true, evalScripts:true, onComplete:function(request){Effect.Fade($('t" + block.to_s + "').down('div'), { duration: 0.5, afterFinish: function() { $('t" + block.to_s + "').down('div').remove() } }); var count = $('lesson_count_" + student.id.to_s + "').down('a'); count.update(parseInt(count.innerHTML) - 1);  render_schedule_day(" + student.id.to_s + ", '" + data.begin.strftime("%Y/%m/%d") + "');}, parameters:'authenticity_token=' + encodeURIComponent('" + form_authenticity_token + "')}); }; return false;\" style=\"color: #700;\">x</a>",
        :schedule_id => data.id,
        :student_id => student.id
      }
    end
    
    
    @day_start = 7
    @day_end   = 20

    @teaching_hours = [{
      1 => [14, 20],
      2 => [19.5, 20],
      3 => [14, 19],
      4 => [14, 20],
      5 => [0, 0],
      6 => [0, 0],
      :color => "#e2fde6"
    },{
      1 => [0, 0],
      2 => [0, 0],
      3 => [7.5, 11],
      4 => [7.5, 11],
      5 => [7.5, 11],
      6 => [0, 0],
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
        Date.new(2008, 6, 28).yday => "",
        
        Date.new(2008, 7, 7).yday => "",
        Date.new(2008, 7, 8).yday => "",
        Date.new(2008, 7, 9).yday => "",
        Date.new(2008, 7, 10).yday => "",
        Date.new(2008, 7, 12).yday => "",
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
        Date.new(2008, 7, 26).yday => "",

        Date.new(2008, 7, 28).yday => "",
        Date.new(2008, 7, 29).yday => "",
        Date.new(2008, 7, 30).yday => "",
        Date.new(2008, 7, 31).yday => "",
        Date.new(2008, 8, 6).yday => "",
        Date.new(2008, 8, 7).yday => "",
        Date.new(2008, 8, 8).yday => "",
        Date.new(2008, 8, 9).yday => "",
        
        Date.new(2008, 8, 14).yday => "",
        Date.new(2008, 8, 15).yday => "",
        Date.new(2008, 8, 16).yday => "",
        
        Date.new(2008, 8, 18).yday => "",
        Date.new(2008, 8, 19).yday => "",
        Date.new(2008, 8, 20).yday => "",
        Date.new(2008, 8, 21).yday => "",
        Date.new(2008, 8, 22).yday => "",
        Date.new(2008, 8, 23).yday => "",
        
        Date.new(2008, 8, 25).yday => "",
        Date.new(2008, 8, 26).yday => "",
        Date.new(2008, 8, 27).yday => "",
        Date.new(2008, 8, 28).yday => "",
        Date.new(2008, 8, 29).yday => "",
        Date.new(2008, 9, 2).yday => "",
    }
    
    
  end
  
  def summer_delete
    if params[:id]
      s = SummerStudent.find(params[:id])
      s.destroy
      redirect_to :action => "summer"
    end
  end
  
  def summer_add
    if params[:schedule]
      if params[:id]
        @student = SummerStudent.update(params[:id], params[:summer_student])
      else
        @student = SummerStudent.create(params[:summer_student])
      end
      
      sc = @student.summer_student_schedule
      for s in sc
        s.destroy
      end
      
      params[:schedule].each_pair do |yday, times|
        unless times.strip == ""
          year = params[:year].to_i
          #first get the date
          date = Date.ordinal(year, yday.to_i)
        
          #split it by commas or endline
          times.strip.split(/,|\n/).each do |time|
            t = time.strip.split(%r{-\s*})
            if t[0].include? ":"
              start = DateTime.strptime("#{date.month}/#{date.day}/#{date.year} #{t[0]}", "%m/%d/%Y %I:%M%p")
            else
              start = DateTime.strptime("#{date.month}/#{date.day}/#{date.year} #{t[0]}", "%m/%d/%Y %I%p")
            end
            if t[1].include? ":"
              finish = DateTime.strptime("#{date.month}/#{date.day}/#{date.year} #{t[1]}", "%m/%d/%Y %I:%M%p")
            else
              finish = DateTime.strptime("#{date.month}/#{date.day}/#{date.year} #{t[1]}", "%m/%d/%Y %I%p")
            end
            SummerStudentSchedule.create :begin => start, :end => finish, :summer_student_id => @student.id
          end
        end #unless
      end #params
      redirect_to :action => "summer"
    end    
    
    @schools = SummerSchool.find(:all)

    @section_path = "Adminitration &raquo; Summer Schedule &raquo; "
    @section_title = 'Adding a new student schedule'
    @submenu = global_submenu
    
    @startdate = Date.new(2008, 6, 15)
    @enddate = Date.new(2008, 9, 2)
    
    @totaldays = (@enddate - @startdate).to_i
    @numberofweeks = (@totaldays / 7.0).ceil
    
    
    
    @schedule = {
        Date.new(2008, 6, 17).yday => "",
        Date.new(2008, 6, 18).yday => "",
        Date.new(2008, 6, 19).yday => "",
        Date.new(2008, 6, 20).yday => "",
        Date.new(2008, 6, 23).yday => "",
        Date.new(2008, 6, 24).yday => "",
        Date.new(2008, 6, 25).yday => "",
        Date.new(2008, 6, 26).yday => "",
        Date.new(2008, 6, 27).yday => "",
        Date.new(2008, 6, 28).yday => "",
        
        Date.new(2008, 7, 7).yday => "",
        Date.new(2008, 7, 8).yday => "",
        Date.new(2008, 7, 9).yday => "",
        Date.new(2008, 7, 10).yday => "",
        Date.new(2008, 7, 12).yday => "",
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
        Date.new(2008, 7, 26).yday => "",

        Date.new(2008, 7, 28).yday => "",
        Date.new(2008, 7, 29).yday => "",
        Date.new(2008, 7, 30).yday => "",
        Date.new(2008, 7, 31).yday => "",
        Date.new(2008, 8, 6).yday => "",
        Date.new(2008, 8, 7).yday => "",
        Date.new(2008, 8, 8).yday => "",
        Date.new(2008, 8, 9).yday => "",
        
        Date.new(2008, 8, 14).yday => "",
        Date.new(2008, 8, 15).yday => "",
        Date.new(2008, 8, 16).yday => "",
        
        Date.new(2008, 8, 18).yday => "",
        Date.new(2008, 8, 19).yday => "",
        Date.new(2008, 8, 20).yday => "",
        Date.new(2008, 8, 21).yday => "",
        Date.new(2008, 8, 22).yday => "",
        Date.new(2008, 8, 23).yday => "",
        
        Date.new(2008, 8, 25).yday => "",
        Date.new(2008, 8, 26).yday => "",
        Date.new(2008, 8, 27).yday => "",
        Date.new(2008, 8, 28).yday => "",
        Date.new(2008, 8, 29).yday => "",
        Date.new(2008, 9, 2).yday => "",
    }
    
    
    
    
    if params[:id]
      @student = SummerStudent.find(params[:id])
      schedule = @student.summer_student_schedule
      for time in schedule
        @schedule[time.begin.yday] += time.to_s + "\n"
      end
    else
      @student = SummerStudent.new
    end
  end
  
  
  
  def siteoptions
    #display current options
    
    
    
    #styles
    

  end
  
=end
  
end
