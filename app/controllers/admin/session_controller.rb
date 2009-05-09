class Admin::SessionController < AdminController
  before_filter :store_location
  #  before_filter :login_from_cookie
  before_filter :login_required
  before_filter :admin_required
  
  def index
    @section_path = "Adminitration &raquo; "
    @section_title = 'Manage Sessions'
    @submenu = global_submenu
    
    @sessions = Session.find(:all, :order => "first DESC")
  end

  def edit
    @section_path = "Adminitration &raquo; Manage Sessions &raquo; "
    @section_title = 'Create New Session'
    @submenu = global_submenu
    
    @schools = School.find(:all)
    
    @days_of_the_week = Date::DAYNAMES[1..6]
    
    @javascripts = ["widgEditor.js"]
    @stylesheets = ["widgEditor.css"]
    
    
    if params[:id]
      @session = Session.find(params[:id])
      season = ['selected="selected"', '', ''] if @session.name.match(/Spring/)
      season = ['', 'selected="selected"', ''] if @session.name.match(/Summer/)
      season = ['', '', 'selected="selected"'] if @session.name.match(/Fall/)
      @year = @session.name.match(/[0-9]+/).to_s
      
      @availabilities = []
      was = @session.weekly_availablity
      was.each do |wa|
        @availabilities[wa.school_id] = [] unless @availabilities[wa.school_id]
        @availabilities[wa.school_id][wa.day] = wa.to_s
      end
      
      @registration_notice = @session.registration_notes
      @active = @session.is_active
      @options = @session.registration_option
    else
      season = ['selected="selected"', '', '']
      @year = Time.now.year + 1
      @registration_notice = ""
      @active = false
      @options = []
    end
    
    @season_opt = "<option value=\"Spring\" #{season[0]}>Spring</option><option value=\"Summer\" #{season[1]}>Summer</option><option value=\"Fall\" #{season[2]}>Fall</option>"
    
  end
  
  def delete
    if params[:id]
      Session.find(params[:id]).destroy()
    end
    redirect_to :action => 'index'
  end
  
  def save
    if params[:id]
      s = Session.find(params[:id])
    else
      s = Session.new
    end

    #save the session
    s.name = params[:session_name] + " " + params[:session_year]["year(1i)"]
    s.is_active = params[:active_reg] ? true : false;
    s.first = Date.parse(params[:session]["first(1i)"] + "/" + params[:session]["first(2i)"] + "/" + params[:session]["first(3i)"])
    s.last = Date.parse(params[:session]["last(1i)"] + "/" + params[:session]["last(2i)"] + "/" + params[:session]["last(3i)"])
    s.registration_notes = params[:notice]
    s.save
    
    #save lesson availability
    params[:schools].each do |school_id, availability|
      availability.each do |day, times|
        times.split(/[,\n]+/).each do |time_str|
          if time_str.strip != ""
            tr = TimeRange.new(time_str)
            
            p = {}
            p[:session_id] = s.id
            p[:school_id] = school_id
            p[:start] = tr.start
            p[:end] = tr.done
            p[:day] = day
            
            wa = WeeklyAvailablity.find(:first, :conditions => { :session_id => s.id, :school_id => school_id, :day => day})
            if wa.nil?
              wa = WeeklyAvailablity.new(p)
            else
              wa.attributes = p
            end #if wa.nil?
            
            wa.save
          end #if
        end #time.split
      end #availability
    end #params
    
    #save each day info
    params[:notes].each do |date_str, note|
      p = {}
      p[:session_id] = s.id
      p[:date] = Date.parse(date_str)
      if params[:offdays]
        p[:offday] = params[:offdays][date_str].nil? ? false : true
      end
      if params[:groups]
        p[:group] = params[:groups][date_str].nil? ? false : true
      end
      p[:note] = note
    
      sd = SessionDay.find(:first, :conditions => { :session_id => s.id, :date => p[:date]})
      if sd.nil?
        sd = SessionDay.new(p)
      else
        sd.attributes = p
      end
      sd.save
    end
    
    #save the registration option
    #purge the existing options because we got new ones!
    opts = RegistrationOption.find(:all, :conditions => { :session_id => s.id })
    opts.each do |opt|
      opt.destroy
    end
    
    #now add the new ones
    if params[:opt_name]
      params[:opt_name].each do |key, name|
        unless name == ""
          p = {}
          p[:session_id] = s.id
          p[:text] = name
          p[:input_type] = params[:opt_type]["#{key}"]
          ro = RegistrationOption.new(p)
      
          ro.save
        end
      end
    end
    
    
    redirect_to :action => 'index'
  end
  
  #ajax call
  def get_date_interval
    meta = {}
    if params[:id]
      session_days = Session.find(params[:id]).session_day
      session_days.each do |day|
        meta[day.date] = {:off_day => day.offday, :group => day.group, :note => day.note}
      end
    end
    
    session[:return_to] = ""
  
    #alphabet madness!!!
    first = Date.parse(params[:start])
    last = Date.parse(params[:end])
    
    if last <= first
      h = {"error" => true}
    else
      cal_start = first - first.wday
      cal_end   = last + (6 - last.wday)
      
      #return array
      a = Array.new
    
      #week count
      c = (last.cweek - first.cweek) + 1
      
      i = 0
      while cal_start <= cal_end #we'll be modifying cal_start... i got lazy and didn't copy it, so sue me
        unless meta[cal_start]
          meta[cal_start] = {}
          meta[cal_start][:off_day] = false
          meta[cal_start][:group] = false
          meta[cal_start][:note] = ""
        end
        
        in_session = (cal_start >= first) && (cal_start <= last)
        a.push({"y" => cal_start.year,
                "m" => cal_start.month,
                "d" => cal_start.day,
                "count" => i,
                "dotw" => cal_start.wday,
                "in_session" => in_session,
                "off_day" => meta[cal_start][:off_day],
                "group" => meta[cal_start][:group],
                "note" => meta[cal_start][:note]
        })
        cal_start += 1
        i += 1
      end
    
      #return hash
      h = {"dates" => a, "week_count"=> c, "error" => false}
    end
    
    render :text => h.to_json
  end
end