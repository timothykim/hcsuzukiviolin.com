class AdminController < ApplicationController
  include AuthenticatedSystem
  include OptionDictionary

  before_filter :store_location
  before_filter :login_from_cookie
  before_filter :login_required
  before_filter :admin_required


  def global_submenu
    [
      { :name => '<img src="/images/icons/users.png" class="icon" /> Users', :link => "/admin/user", :selected => "selected" },
      { :name => '<img src="/images/icons/calendar.png" class="icon" /> Summer Schedule', :link => "/admin/summer" },
      # { :name => '<img src="/images/icons/globe.png" class="icon" /> Site', :link => "#" },
      # { :name => '<img src="/images/icons/announce.png" class="icon" /> Announcements', :link => "#" },
      # { :name => '<img src="/images/icons/news.png" class="icon" /> Newsletter', :link => "#" }
    ]
  end


  def index
    @section_title = "Administration"
    @submenu = global_submenu
  end
  
  def user
    @section_path = "Adminitration &raquo; "
    @section_title = 'User'
    @submenu = global_submenu
    
    @sort_by = {:time => "selected", :name => "", :activated => ""}
    dir = (params[:dir]) ? params[:dir] : "DESC"
    d_sym = (dir == "DESC") ? "&uarr;" : "&darr;"
    @dir_sym = {:time => d_sym, :name => "", :activated => ""}
    

    sort = "created_at"
    if params[:sort] == "name"
      sort = "lastname"
      @sort_by = {:time => "", :name => "selected", :activated => ""}
      @dir_sym = {:time => "", :name => d_sym, :activated => ""}
    end
    
    if params[:sort] == "activated"
      sort = "activated"
      @sort_by = {:time => "", :name => "", :activated => "selected"}
      @dir_sym = {:time => "", :name => "", :activated => d_sym}
    end
    
    @newdir = (dir == "DESC") ? "ASC" : "DESC"
    
    @users = User.find(:all, :order => "#{sort} #{dir}")
  end
  
  def usersave
    users = User.find(:all)
    
    users.each do |user|
      p = (params[:users]) ? params[:users]["#{user.id}"] : nil
      unless user.is_admin
        if p.nil?
          user.update_attributes!({:activated => false, :email_confirmation => user.email})
        else
          unless user.activated
            user.update_attributes!({:activated => true, :email_confirmation => user.email})
            Notifier.deliver_activation_notification(user)
          end
        end
      end
    end
    
    flash[:notice] = "Save Successful!"
 
    redirect_to :action => "user"
  end
  
  
  def summer
    @section_path = "Adminitration &raquo; "
    @section_title = 'Summer Schedule'
    
    @submenu = global_submenu
    
    @students = SummerStudent.find(:all)
  end
  
  def summer_student_json
    headers["Content-Type"] = "text/x-json; charset=utf-8"
    
    student = SummerStudent.find(params[:id])
    schedules = student.summer_student_schedule
    
    events = []
    for event in schedules
      start, finish = event.begin.to_time.to_i, event.end.to_time.to_i
      
      today_begin = Time.local(event.begin.year, event.begin.month, event.begin.day, params[:day_start].to_i)
      today_end = Time.local(event.end.year, event.end.month, event.end.day, params[:day_end].to_i)
      
      if event.begin.hour < params[:day_start].to_i
        start = today_begin.to_i
      end
      
      events << [start, finish] unless (finish < today_begin.to_i)
    end
    
    data = { :events => events }

    render :text => data.to_json
  end
  
  def summer_schedule
    @section_path = "Adminitration &raquo; "
    @section_title = 'Summer Schedule Edit'
    
    @startdate = Date.new(2008, 6, 15)
    @enddate = Date.new(2008, 9, 2)
    
    @totaldays = (@enddate - @startdate).to_i
    @numberofweeks = (@totaldays / 7.0).ceil
    
    @students = SummerStudent.find(:all)
    
    @day_start = 13;
    @day_end   = 20;

    @teaching_hours = {
      1 => [14, 20],
      2 => [19.5, 20],
      3 => [14, 19],
      4 => [14, 20],
      5 => [0, 0]
    }
    
    
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
          times.split(/,|\n/).each do |time|
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
  
  
end
