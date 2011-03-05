class SbcController < ApplicationController

  before_filter :store_location
  before_filter :login_required, :only => :register

  def global_submenu
    [
      { :name => '<img src="/images/icons/home.png" class="icon" /> SBC Home', :link => "/sbc/index", :selected => "selected" },
      { :name => '<img src="/images/icons/music.png" class="icon" /> About SBC', :link => "/sbc/about" },
      { :name => '<img src="/images/icons/calendar.png" class="icon" /> Program Schedule', :link => "/sbc/schedule" },
      { :name => '<img src="/images/icons/email.png" class="icon" /> Contact Us', :link => "/sbc/contact" },
      { :name => '<img src="/images/icons/write.png" class="icon" /> Register!', :link => "/sbc/register" },
    ]
  end
    
  def index
    @section_title = "Welcome to Suzuki Baby Class!"
      
    @submenu = self.global_submenu
  end

  def about
    @section_title = "About Suzuki Baby Class"
    @section_path = "Suzuki Baby Class &raquo; "
    
    
    @submenu = self.global_submenu
  end

  def schedule 
    @section_title = "Upcoming Scheduled Classes"
    @section_path = "Suzuki Baby Class &raquo; "
    
    
    @submenu = self.global_submenu
  end

  def contact
    @section_path = "Suzuki Baby Class &raquo; "
    @section_title = "Contact us"
    
    @submenu = self.global_submenu
  end

  def register
    @section_title = "Register for Suzuki Baby Class"
    @section_path = "Suzuki Baby Class &raquo; "
    
    @submenu = self.global_submenu

    @parent = current_user

    @show_status = false

    #check if the user already has a student registered
    if params[:student]
      @student = Student.find(params[:student])
    elsif current_user.sbc_student
      @student = current_user.sbc_student
      @show_status = true
    else
      @student = Student.new
    end

  end

  def save
    #save the parent's information
    parent = User.find(params[:parent][:id])
    parent.attributes = params[:parent]
    parent.email_confirmation = params[:parent][:email]
    parent.save

    if params[:student][:id] != ""
      student = parent.sbc_student
    else
      student = parent.students.new
    end

    student.attributes = params[:student]
    student.save

    if student.sbc_registration
      sbcr = student.sbc_registration
      sbcr.save
    else 
      sbcr = SbcRegistration.new
      sbcr.student = student
      sbcr.save
    end


    redirect_to :action => 'done'
  end

  def done
    @section_title = "Thank you for Registering!"
    @section_path = "Suzuki Baby Class &raquo; "
    
    @submenu = self.global_submenu
  end
end
