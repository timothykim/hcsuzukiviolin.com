class Registration < ActiveRecord::Base
  belongs_to :school
  belongs_to :session
  belongs_to :student
  has_many :registered_days
  has_many :registered_dates
  has_many :registered_options
  has_many :registered_group_classes
end
