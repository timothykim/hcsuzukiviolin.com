class Student < ActiveRecord::Base
  belongs_to :users
  has_many :registrations
  
  def to_s
    [self.first_name, self.last_name].join(" ")
  end
end
