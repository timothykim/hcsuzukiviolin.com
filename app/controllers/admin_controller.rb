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
  
  
  def summer_add
    if params[:schedule]
      @student = SummerStudent.create :name => params[:name], :school_id => params[:school], :lesson_duration => params[:duration]
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
    
    
    @schedule = [
        Date.new(2008, 6, 17),
        Date.new(2008, 6, 18),
        Date.new(2008, 6, 19),
        Date.new(2008, 6, 20),
        Date.new(2008, 6, 23),
        Date.new(2008, 6, 24),
        Date.new(2008, 6, 25),
        Date.new(2008, 6, 26),
        Date.new(2008, 6, 27),
        Date.new(2008, 7, 7),
        Date.new(2008, 7, 8),
        Date.new(2008, 7, 9),
        Date.new(2008, 7, 10),
        Date.new(2008, 7, 11),
        Date.new(2008, 7, 14),
        Date.new(2008, 7, 15),
        Date.new(2008, 7, 16),
        Date.new(2008, 7, 17),
        Date.new(2008, 7, 18),
        Date.new(2008, 7, 19),
        Date.new(2008, 7, 21),
        Date.new(2008, 7, 22),
        Date.new(2008, 7, 23),
        Date.new(2008, 7, 24),
        Date.new(2008, 7, 25),
        Date.new(2008, 7, 28),
        Date.new(2008, 7, 29),
        Date.new(2008, 7, 30),
        Date.new(2008, 7, 31),
        Date.new(2008, 8, 6),
        Date.new(2008, 8, 7),
        Date.new(2008, 8, 8),
        Date.new(2008, 8, 14),
        Date.new(2008, 8, 15),
        Date.new(2008, 8, 18),
        Date.new(2008, 8, 19),
        Date.new(2008, 8, 20),
        Date.new(2008, 8, 21),
        Date.new(2008, 8, 22),
        Date.new(2008, 8, 25),
        Date.new(2008, 8, 26),
        Date.new(2008, 8, 27),
        Date.new(2008, 8, 28),
        Date.new(2008, 8, 29),
        Date.new(2008, 8, 30),
        Date.new(2008, 9, 2)
    ]
  end
  
  
  
  def siteoptions
    #display current options
    
    
    
    #styles
    

  end
  
  
end
