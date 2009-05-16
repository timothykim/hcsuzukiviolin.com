class Session < ActiveRecord::Base
  has_many :weekly_availablities, :dependent => :destroy
  has_many :session_days, :dependent => :destroy
  has_many :registration_options, :dependent => :destroy
  has_many :registrations, :order => "updated_at DESC"
  
  DAY_TYPE = 0
  DATE_TYPE = 1
  
  def to_s
    self.name
  end
end
