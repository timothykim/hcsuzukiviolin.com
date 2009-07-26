class Admin::TimesheetController < AdminController
  def index
    @section_path = "Adminstration &raquo; "
    @section_title = "Timesheets"

    @submenu = global_submenu

    @sessions = Session.find(:all, :order => "first DESC")
  end

  def show 
    @section_path = "Adminstration &raquo; Timesheets &raquo; "

    @current_session = Session.find(params[:id])

    @section_title = @current_session.name 
    @total_week = (@current_session.last.cweek - @current_session.first.cweek) + 1
  end
end
