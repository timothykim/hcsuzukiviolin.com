class TimeRange
  attr_accessor :start, :done, :range
  def initialize(range)
    @range = range
    
    a = range.split(/[-~]/)
    s, d = clean(a[0], a[1])
    
    @start = Time.parse(s)
    @done = Time.parse(d)
  end
  
  #err why doesn't ruby support copy constructor???
  def TimeRange.make_new(s_time, d_time)
    return TimeRange.new(s_time.strftime("%I:%M%p") + "-" + d_time.strftime("%I:%M%p"))
  end
  
  def clean(s, d)
    #gasp! we are assuming s and d are pretty much in time format... -_-;;
    s = s.strip.downcase
    d = d.strip.downcase
    
    if s.match(/^[\d:]+[ap]m$/) and d.match(/^[\d:]+[ap]m$/)
      # in good format, do nothing and return
      return s, d
    elsif s.match(/^[\d:]+[ap]m$/) or d.match(/^[\d:]+[ap]m$/)
      # only one of them has pm or am mark, copy it to the other
      return s, d+"pm" if s.match(/^[\d:]+pm$/)
      return s, d+"am" if s.match(/^[\d:]+am$/)
      return s+"pm", d if d.match(/^[\d:]+pm$/)
      return s+"am", d if d.match(/^[\d:]+am$/)
    else
      #neither has pm or am, so make sure it is in the format of HH:MM
      unless s.match(/^\d+:\d+$/)
        s = s + ":00"
      end
      unless d.match(/^\d+:\d+$/)
        d = d + ":00"
      end
      return s, d
    end
  end
end
