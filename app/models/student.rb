class Student < ActiveRecord::Base
  belongs_to :user
  has_many :registrations
  has_many :lessons, :through => :registration
  
  def to_s
    [self.first_name, self.last_name].join(" ")
  end

  def age 
    age = Date.today.year - self.dob.year
    age -= 1 if self.dob > Date.today.years_ago(age) #if birthday has yet to pass then subtract one
    return age
  end
  
  def registered?(sess)
    return true if self.get_registration(sess)
    return false
  end
  
  def confirmed?(sess)
    return self.get_registration(sess).confirmed
  rescue
    return false
  end
  
  def get_registration(sess)
    return self.registrations.find(:first, :conditions => {:session_id => sess.id})
  end
  
  def current_or_new_registration(sess)
    reg = self.registrations.find(:first, :conditions => {:session_id => sess.id})
    if reg.nil?
      reg = self.registrations.new
    end
    return reg
  end
  
  def status(sess)
    reg = self.registrations.find(:first, :conditions => {:session_id => sess.id})
    unless reg
      return "<img src=\"/images/icons/exclamation.png\" class=\"icon\"> Not Registered" 
    end
    
    if reg.confirmed
      return "<img src=\"/images/ok.png\" class=\"icon\"> Registered!" 
    else
      return "<img src=\"/images/icons/processing.png\" class=\"icon\"> Processing..."
    end
  end
end
