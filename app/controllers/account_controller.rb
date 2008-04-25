class AccountController < ApplicationController
  # Be sure to include AuthenticationSystem in Application Controller instead
  include AuthenticatedSystem
  # If you want "remember me" functionality, add this before_filter to Application Controller
  before_filter :login_from_cookie

  # say something nice, you goof!  something sweet.
  def index
    redirect_to(:action => 'login') unless logged_in? # || User.count > 0
    redirect_to(:controller => 'display', :action => 'index')
  end

  def login
    
    @section_title = "Account Login"
    
    if logged_in?
      redirect_to(:action => 'index')
    end
    
    return unless request.post?
    self.current_user = User.authenticate(params[:login], params[:password])

    if logged_in?
      if params[:remember_me] == "1"
        self.current_user.remember_me
        cookies[:auth_token] = { :value => self.current_user.remember_token,
                                  :expires => self.current_user.remember_token_expires_at }
      end
      
      #set last logged in
      
      redirect_back_or_default(:controller => '/display', :action => 'index')
      flash[:notice] = "Logged in successfully"
    else
      flash[:notice] = "Your email, password combination is not in the system. Please try again."
    end
  end
  
  def unauthorized
      @s = session[:return_to]
  end
  
  
  def activate    
    @section_title = "Thank you for signing up, #{current_user.fullname}!" if logged_in?
    redirect_to :action => 'login' unless logged_in?  
    redirect_to :action => 'index' if logged_in? && self.current_user.activated

  end

  def signup
    redirect_to :action => 'activate' if logged_in?
    
    
    @section_title = "Sign up for an Account"
    
    @user = User.new(params[:user])
    return unless request.post?
    @user.save!
    self.current_user = @user
    redirect_back_or_default(:controller => '/account', :action => 'activate')
    flash[:notice] = "Thanks for signing up!"
  rescue ActiveRecord::RecordInvalid
    render :action => 'signup'
  end
  
  def settings
    @section_title = "Editing Your Personal Information"
    
    @user = self.current_user
    
    return unless params[:user]
    
    if @user.email == params[:user][:email] and params[:user][:email_confirmation] == ""
      params[:user][:email_confirmation] = params[:user][:email]
    end
    
    @user.avatar.destroy if @user.avatar
    Avatar.create!(params[:avatar])
    
    if @user.update_attributes(params[:user])
      flash[:notice] = 'User was successfully updated.'
      redirect_to :action => 'settings'
    else
      render :action => "settings"
    end
  end

  def logout
    self.current_user.forget_me if logged_in?
    cookies.delete :auth_token
    reset_session
    flash[:notice] = "You have been logged out."
    redirect_back_or_default(:controller => '/display', :action => 'index')
  end
  
  
end
