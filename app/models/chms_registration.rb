class ChmsRegistration < ActiveRecord::Base
  validates_presence_of     :firstname
  validates_presence_of     :lastname
  validates_presence_of     :email
  validates_presence_of     :email
  validates_presence_of     :student_firstname
  validates_presence_of     :student_lastname
  validates_presence_of     :chms_hours
end
