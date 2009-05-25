class Registration < ActiveRecord::Base
  belongs_to :school
  belongs_to :session
  belongs_to :student
  has_many :registered_days, :dependent => :destroy
  has_many :registered_dates, :dependent => :destroy
  has_many :registered_options, :dependent => :destroy
  
  #only call from console
  def clean_all
    self.registered_dates.each do |date|
      date.clean
    end
  end

end
