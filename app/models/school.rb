class School < ActiveRecord::Base
  has_many :registrations
  has_many :locations
end
