class Session < ActiveRecord::Base
  has_many :weekly_availablity, :dependent => :destroy
  has_many :session_day, :dependent => :destroy
  has_many :registration_option, :dependent => :destroy
end
