class Session < ActiveRecord::Base
  has_many :weekly_availablities, :dependent => :destroy
  has_many :session_days, :dependent => :destroy
  has_many :registration_options, :dependent => :destroy
  has_many :registrations, :order => "created_at DESC"
  has_many :students, :through => :registrations
  has_many :lessons, :through => :registrations, :order => "time ASC"
  
  DAY_TYPE = 0
  DATE_TYPE = 1
  
  def to_s
    self.name
  end

  def is_offday?(today)
    d = self.session_days.find_by_date(today)
    return true if d.nil?
    return d.offday
  end
end
