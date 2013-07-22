class Location < ActiveRecord::Base
  has_many :lessons
  belongs_to :school
end
