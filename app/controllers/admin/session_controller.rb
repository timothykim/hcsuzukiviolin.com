class Admin::SessionController < AdminController
  before_filter :store_location
  #  before_filter :login_from_cookie
  before_filter :login_required
  before_filter :admin_required
  
  def index
    @section_path = "Adminitration &raquo; "
    @section_title = 'Manage Sessions'
    @submenu = global_submenu
  end

  def new
    @section_path = "Adminitration &raquo; Manage Sessions &raquo; "
    @section_title = 'Create New Session'
    @submenu = global_submenu
    
    @schools = School.find(:all)
    
    @days_of_the_week = Date::DAYNAMES[1..6]
  end
  
  
  def create
    @p = params
  end
  
  #ajax call
  def get_date_interval
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
      while cal_start <= cal_end
        in_session = (cal_start >= first) && (cal_start <= last)
        a.push({"y"=>cal_start.year, "m"=>cal_start.month, "d"=>cal_start.day, "count"=>i, "dotw"=>cal_start.wday, "in_session"=>in_session})
        cal_start += 1
        i += 1
      end
    
      #return hash
      h = {"dates" => a, "week_count"=> c, "error" => false}
    end
    
    render :text => h.to_json
  end
end