class AttendanceController < ApplicationController
  skip_before_filter :is_attendance_user, :only => [:index]

  def index
    session = Session.current
    today = Time.now.wday
    @lessons = session.lessons.select { |lesson| lesson.time.wday == today }
  end

  def checkin
    code = params[:code]
    id = code[-3,3]
    @user = User.find(id.to_i)
    @students = 
  end

  def unauthorized
  end
  
private
  def is_attendance_user
    if !current_user
      redirect_to :action => "unauthorized"
    end
    unless current_user.fullname == "Attendance Taker"
      redirect_to :action => "unauthorized"
    end
  end
end
