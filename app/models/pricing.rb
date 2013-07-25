class Pricing < ActiveRecord::Base
  belongs_to :session

  GROUP = "Group"
  INDIVIDUAL = "Individual"
  REGISTRATION_FEE = "Registration Fee"

end
